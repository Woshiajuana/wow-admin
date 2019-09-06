'use strict';

const Controller = require('egg').Controller;
const SESSION_NAME = 'modify-mobile';

module.exports = class ModifyMobileController extends Controller {

  static route (app, middlewares, controller) {
    const { get, post } = app.router;

    post('/api/base/v1/operator/modify-mobile/authorization',
      middlewares.accessToken(),
      controller.authorization);

    post('/api/base/v1/operator/modify-mobile/modify-mobile',
      middlewares.accessToken(),
      middlewares.authToken({ sessionName: SESSION_NAME, isEnd: true }),
      middlewares.logger({ group: '操作员', name: '修改手机', level: 0 }),
      controller.modifyMobile);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/operator/modify-mobile/authorization 修改手机号授权
   *
   *
   * @apiDescription 修改手机号授权
   *
   * @apiGroup Operator
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/modify-mobile/authorization
   *
   */
  async authorization () {
    const { ctx, logger } = this;
    const { accessData } = ctx;

    const steps = [];
    const { SMS, OTP, EMAIL } = await this.service.base.operatorService.operatorVerify(accessData.operator);

    // 登陆是否安全验证
    if (SMS || OTP || EMAIL) {
      steps.push('identity-verify');
    }
    const authData = await ctx.createAuthData({
      id: accessData.id,
      sessionName: SESSION_NAME,
      steps,
    });

    ctx.formatSuccessResp({
      data: authData.toResp(),
    });

    logger.info(`用户: ${accessData.id} 修改手机号授权成功`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/operator/modify-mobile/modify-mobile 修改手机号
   *
   *
   * @apiDescription 修改手机号
   *
   *
   * @apiGroup Operator
   *
   * @apiParam {string} auth_token 输入auth_token
   * @apiParam {String} phone_no 手机号
   * @apiParam {String} captcha 输入手机验证码值
   * @apiParam  {String} captcha_token 验证码token
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/modify-mobile/modify-mobile
   *
   */
  async modifyMobile () {
    const { ctx, logger, app } = this;
    const { accessData } = ctx;
    let { mobile, captcha } = ctx.request.body;

    mobile = mobile.trim();

    if (!mobile || !app.validator.isMobilePhone(mobile, 'zh-CN')) {
      logger.info(`${mobile} 不是一个手机号`);
      ctx.formatFailResp({ errCode: 'F400001' });
      return;
    }

    if (!captcha || !app.validator.isValid(
      { captcha: { type: 'string', min: 6, max: 6, format: /^\d+$/ } },
      { captcha }
    )) {
      logger.info('验证码格式不合法');
      ctx.formatFailResp({ errCode: 'F400004' });
      return;
    }

    const captchaVerifyRes = await this.service.base.utils.smsService.verifySmsCaptcha(mobile, captcha, false);
    if (!captchaVerifyRes) {
      ctx.throwError('验证码不正确或已经过期');
      return;
    }

    await this.service.base.operatorService.modifyMobile({ operatorNo: accessData.id, mobile });

    // update accessData mobile
    const lastUserMobile = accessData.operator.mobile;
    accessData.operator.mobile = mobile;
    accessData.flush();

    ctx.formatSuccessResp();

    await this.service.base.utlis.smsService.invalidSmsCaptcha(mobile, captcha);

    logger.info(`用户 ${accessData.id} 设置修改手机号成功 从 ${lastUserMobile} 改为 ${mobile}`);
  }

  // -- end
};

