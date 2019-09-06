'use strict';

const Controller = require('egg').Controller;
const speakeasy = require('speakeasy');
const crypto = require('crypto');
const uuid = require('uuid');
const ms = require('ms');

const IMAGE_CAPTCHA_TOKEN_MAX_AGE = '2m';

const SESSION_NAME = 'modify-otp';

module.exports = class ModifyOtpController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    post('/api/base/v1/operator/modify-otp/authorization',
      middlewares.accessToken(),
      controller.authorization);

    post('/api/base/v1/operator/modify-otp/google-otp-gen',
      middlewares.accessToken(),
      middlewares.authToken({ module: 'google-qr-gen' }),
      controller.googleQRGen);

    post('/api/base/v1/operator/modify-otp/modify-otp',
      middlewares.accessToken(),
      middlewares.authToken({ sessionName: SESSION_NAME, isEnd: true }),
      middlewares.logger({ group: '操作员', name: '绑定动态口令', level: 0 }),
      controller.modifyOtpCode);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/operator/modify-otp/authorization 修改口令码授权
   *
   *
   * @apiDescription 修改口令码授权
   *
   * @apiGroup Operator
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/modify-otp/authorization
   *
   */

  async authorization() {
    const { ctx, logger } = this;
    const { accessData } = ctx;

    const steps = [];
    const { SMS, OTP, EMAIL } = await this.service.base.operatorService.operatorVerify(accessData.operator);

    // 登陆是否安全验证
    if (SMS || OTP || EMAIL) {
      steps.push('identity-verify');
    }

    steps.push('google-qr-gen');
    const authData = await ctx.createAuthData({
      id: accessData.id,
      sessionName: SESSION_NAME,
      steps,
    });

    ctx.formatSuccessResp({
      data: authData.toResp(),
    });

    logger.info(`用户 ${accessData.id} Google两步校验授权申请 成功`);
  }

  async googleQRGen() {
    const { ctx, logger } = this;
    const { accessData } = ctx;
    const { redis } = this.app;
    const { operator_no, user_name, email } = accessData ? accessData.operator : {};
    const appName = accessData && accessData.app ? accessData.app.name : 'System';

    logger.info('生成Google二维码请求 operator_no：' + operator_no + ', user_name：' + user_name);

    if (!operator_no) {
      logger.info('email 或 operator_no 为空!');
      ctx.formatFailResp({ errCode: 'F400006' });
      return;
    }

    const generateSecret = speakeasy.generateSecret({
      name: `${appName}:${email}`,
      symbols: true,
    });

    const secret = generateSecret.base32;
    const optAuthUrl = generateSecret.otpauth_url;

    const wordToken = crypto.createHash('md5').update(uuid()).digest('hex');

    logger.info(`请求创建WordToken : ${wordToken}`);
    await redis.set(wordToken, JSON.stringify({ optAuthUrl, secret }), 'EX', 600);
    logger.info(`请求创建WordToken 成功 wordToken: ${wordToken} 过期时间: ${IMAGE_CAPTCHA_TOKEN_MAX_AGE}`);

    ctx.formatSuccessResp({ data: { optAuthUrl, wordToken } });
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/operator/modify-otp/modify-otp 修改动态口令
   *
   *
   * @apiDescription 修改动态口令
   *
   *
   * @apiGroup Operator
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/modify-otp/modify-otp
   *
   */

  async modifyOtpCode() {
    const { ctx, logger } = this;
    const { redis } = this.app;
    const { accessData } = ctx;
    const { captcha, word_token, appId } = ctx.request.body;
    const { operator_no, user_name, email } = accessData ? accessData.operator : {};

    logger.info(`校验身份验证器口令: operator_no: ${operator_no}, captcha: ${captcha} user_name：' + ${user_name}`);

    const secretStr = await redis.get(word_token);
    if (!secretStr) {
      ctx.formatFailResp({ errCode: 'F490005' });
      return;
    }
    const secretObj = JSON.parse(secretStr);
    const result = speakeasy.totp.verify({
      secret: secretObj.secret,
      encoding: 'base32',
      token: captcha,
    });

    logger.info('verify result >>>> ', result);

    if (!result) {
      ctx.formatFailResp({ errCode: 'F490005' });
      return;
    }

    logger.info(`保存身份验证器秘钥到DB: operator_no: ${operator_no}`);

    await this.service.base.operatorService.modifyOptCode({ operatorNo: operator_no, secret: secretObj.secret });
    accessData.operator.otp_key = '*';
    accessData.flush();

    logger.info(`用户: ${accessData.id} 修改口令码授权成功`);

    ctx.formatSuccessResp();
  }
};

