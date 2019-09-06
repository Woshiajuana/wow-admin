'use strict';

const Controller = require('egg').Controller;
const speakeasy = require('speakeasy');

const MODULE_NAME = 'identity-verify';

module.exports = class VerifyController extends Controller {

  static route (app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/base/v1/operator/verify/identity',
      middlewares.authToken({ module: MODULE_NAME }),
      controller.verify);

    get('/api/base/v1/operator/verify/identity',
      controller.info);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/operator/verify/identity 身份验证
   *
   * @apiDescription 身份验证
   *
   * @apiGroup Verify
   *
   * @apiParam  {String="SMS","OTP"} captcha_type 验证码类型短信或OPT
   * @apiParam  {String} captcha 验证码
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.session_name
   * @apiSuccess (成功) {Object} data.auth_token
   * @apiSuccess (成功) {Object} data.auth_next_stepmod
   * @apiSuccess (成功) {Object} data.auth_max_age
   *
   * @apiSampleRequest /api/base/v1/operator/verify/identity
   *
   */
  async verify () {
    const { ctx, logger, app, service } = this;
    const { captcha_type, captcha } = ctx.request.body;
    const { authData } = ctx;

    logger.info(`用户 ${authData.id} 身份验证验证开始`);

    if (!captcha || !app.validator.isValid(
      { captcha: { type: 'string', min: 6, max: 6, format: /^\d+$/ } },
      { captcha }
    )) {
      ctx.throwError('验证码格式不合法');
      return;
    }

    const operator = await service.base.operatorService.findByOperatorNo(authData.id, false);

    let captchaVerifyRes = false;

    if (captcha_type === 'OTP') {
      if (!operator.otp_key) {
        ctx.throwError(`该账户${authData.id}尚未配置口令码, 请联系管理员`);
        return;
      }

      captchaVerifyRes = speakeasy.totp.verify({
        secret: operator.otp_key,
        encoding: 'base32',
        token: captcha,
      });

      if (operator.otp_key === 'dev') {
        captchaVerifyRes = true;
      }

    } else if (captcha_type === 'SMS') {
      if (!operator.mobile) {
        ctx.throwError(`该账户${authData.id}尚未配置手机号, 请联系管理员`);
        return;
      }

      captchaVerifyRes = await service.base.utlis.smsService.verifySmsCaptcha(operator.mobile, captcha, true);
    }

    if (!captchaVerifyRes) {
      ctx.throwError('验证码不正确或已经过期');
      return;
    }

    logger.info(`用户 ${authData.id} 身份验证验证完成`);

    ctx.formatSuccessResp();
  }


  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/operator/verify/identity 身份验证信息
   *
   * @apiDescription 身份验证信息
   *
   * @apiGroup Verify
   *
   * @apiParam  {String} uid 验证码
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.SMS
   * @apiSuccess (成功) {Object} data.OTP
   *
   * @apiSampleRequest /api/base/v1/operator/verify/identity
   *
   */
  async info () {
    const { ctx, service, logger } = this;
    const { helper } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { uid } = requestData;
    const operator = await service.base.operatorService.findByOperatorNo(uid, false);

    if (!operator) {
      logger.info(`uid ${uid}不存在`);
      ctx.throwError(`uid ${uid}不存在`, 'F400');
      return;
    }

    const data = await this.service.base.operatorService.operatorVerify(operator);

    ctx.formatSuccessResp({ data });

    logger.info(`uid ${uid} 完成`);
  }

};
