'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');
const ms = require('ms');
const moment = require('moment');
const randomstring = require('randomstring');

module.exports = class SmsCaptchaController extends Controller {

  static route(app, middlewares, controller) {
    const { post } = app.router;

    post('/api/base/v1/utlis/smsCaptcha/createCaptcha', controller.create);
    post('/api/base/v1/utlis/smsCaptcha/verifyCaptcha', controller.verifyCaptcha);
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/utlis/smsCaptcha/createCaptcha 短信验证码
   * @apiDescription 获取短信验证码
   *
   * 验收条件：
   * 1. 该API搜到限频控制，配置 'config.limitRequestApis.smsCaptcha' 和设备相关的限制频
   * 2. 如果为非空则user_name 为大陆手机号格式。如果为空则必须是当前登录状态
   * 3. 单个手机号发送收平台单日条数限制, 并显示限制原因
   * 4. 如果是登录状态，不写手机号 默认当前登录用户
   * 5. 返回发送目标手机的脱敏 格式 150****3467
   *
   * @apiGroup Captcha
   *
   * @apiParam {String} [user_name] 手机号
   * @apiParam {String} appKey 应用密钥
   * @apiParam {String} appId 应用ID
   * @apiParam {String} templateNo 短信模板号
   * @apiParam {String} appNo appNo
   * @apiParam {String="T","F","N"} [is_check_user_name] 是否要验证用户是否存在 可选值：T/F/N T要验证不存在,F不验证，N验证已存在
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiError (失败) {String} F400001 用户名格式不正确
   * @apiError (失败) {String} F429 频繁请求，请稍后尝试
   *
   * @apiSampleRequest /api/base/v1/utlis/smsCaptcha/createCaptcha
   *
   */
  async create() {
    const { ctx, app, logger, service } = this;
    const { helper } = ctx;
    const { redis } = app;
    const { uid, mobile } = ctx.request.body;

    if (mobile && !app.validator.isMobilePhone(mobile, 'zh-CN')) {
      logger.info(`手机号码格式错误${mobile}`);
      ctx.throwError('手机号码格式错误', 'F400');
      return;
    }

    // 获取sms配置
    const operator = await service.base.operatorService.findByOperatorNo(uid, false);
    const orgAppConfigObj = await service.base.appConfigService.findAppConfigObjByCondition({ app_no: operator.app_no });
    const { sms } = orgAppConfigObj;

    if (!sms.appKey || !sms.appId || !sms.templateNo) {
      logger.info(`发送短信请求失败>>>> 缺少配置参数 sms:${JSON.string(sms, null, '\t')}`);
      ctx.formatFailResp({ errCode: 'F400003' });
      return;
    }

    // 生成验证码
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    const captcha = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const mobilePhoneNo = mobile || operator.mobile;

    const sendData = {
      target: mobilePhoneNo,
      appId: sms.appId,
      templateNo: sms.templateNo,
      jsonString: JSON.stringify({ captcha, datetime }),
    };

    // 加签
    const msgContentArr = [];
    Object.keys(sendData).sort().forEach(key => {
      msgContentArr.push(`${key}=${sendData[key]}`);
    });
    const msgContent = msgContentArr.join('&') + `&key=${sms.appKey}`;
    sendData.sign = crypto.createHash('sha1').update(msgContent).digest('hex');

    await service.pass.smsService.curl('/api/v1/sms/send-sms', { data: sendData });

    // 存储验证码到redis
    const smsMaxAge = ms(this.config.smsMaxAge || '5m');
    const redisKey = `captcha:${mobilePhoneNo}`;
    logger.info(`sendSmsCaptcha Complete. mobileNo:${mobilePhoneNo} captcha: ${captcha} 有效期 ${smsMaxAge}`);
    await redis.set(redisKey, captcha, 'EX', smsMaxAge * 0.001);

    ctx.formatSuccessResp({
      data: {
        mobile: helper.concealString(mobilePhoneNo, { start: 3, end: -4 }),
      },
    });
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/utlis/smsCaptcha/verifyCaptcha 验证短信验证码
   *
   * @apiDescription 验证短信验证码
   *
   * @apiGroup Captcha
   *
   * @apiParam {String} mobile 手机号
   * @apiParam {String} captcha 短信模板号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiError (失败) {String} F400001 用户名格式不正确
   * @apiError (失败) {String} F429 频繁请求，请稍后尝试
   *
   * @apiSampleRequest /api/base/v1/utlis/smsCaptcha/verifyCaptcha
   *
   */
  async verifyCaptcha() {
    const { ctx, app, logger, service } = this;
    const { mobile, captcha } = ctx.request.body;

    if (!mobile || !captcha) {
      logger.info(`参数错误：${ctx.request.body}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    if (!mobile || !app.validator.isMobilePhone(mobile, 'zh-CN')) {
      logger.info(`mobile 不是一个手机号 ${mobile}`);
      ctx.formatFailResp({ errCode: 'F400001' });
      return;
    }


    const data = await service.base.utlis.smsService.verifySmsCaptcha(mobile, captcha, true);

    // here 绑定 redis

    ctx.formatSuccessResp({ data });
  }
};
