'use strict';

const Controller = require('egg').Controller;

const SESSION_NAME = 'forget-password';


module.exports = class ForgetPasswordController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    post('/api/base/v1/operator/forget-password/authorization',
      controller.authorization);

    post('/api/base/v1/operator/forget-password/update-password',
      middlewares.authToken({ sessionName: SESSION_NAME, isEnd: true }),
      middlewares.logger({ group: '操作员', name: '忘记密码', level: 0 }),
      controller.updatePassword);
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/operator/forget-password/authorization 修改密码授权申请
   *
   * @apiDescription 修改密码授权申请
   *
   * @apiGroup ForgetPassword
   *
   * @apiParam  {String} login_name 用户名
   * @apiParam  {String} domain 应用域名
   * @apiParam  {String} captcha 验证码
   * @apiParam  {String} captcha_token 验证码token
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiError (失败) {String} F401 未授权
   *
   * @apiSampleRequest /api/base/v1/operator/forget-password/authorization
   *
   */
  async authorization() {
    const { ctx, logger } = this;
    let { login_name, domain, captcha, captcha_token } = ctx.request.body;

    if (login_name) {
      login_name = login_name.toLowerCase();
    }

    if (!login_name) {
      ctx.throwError('用户名不能为空', 'F400');
    }

    if (!domain) {
      ctx.throwError('domain不能为空', 'F400');
    }

    const orgApp = await this.service.base.appService.findOrgAppByCondition({ domain });
    if (!orgApp) {
      ctx.throwError(`${domain} App不存在错误`, 'F400');
      return;
    }

    const org = await this.service.base.orgService.findOrgByOrgNo({ orgNo: orgApp.org_no });
    if (!org) {
      ctx.throwError(`${domain} App不存在错误`, 'F400');
      return;
    }

    const operator = await this.service.base.operatorService.findByLoginName({ loginName: login_name, appNo: orgApp.app_no });
    if (!operator) {
      ctx.throwError(`该账户 ${login_name} 不存在`);
    }

    if (operator.status === 'disabled') {
      logger.info(`该账户 ${login_name} 已经被停用, 请联系管理员`);
      ctx.throwError(`该账户 ${login_name} 已经被停用, 请联系管理员`);
      return;
    }

    // -----

    if (!captcha || !captcha_token) {
      ctx.throwError('验证码不能为空', 'F400');
      return;
    }

    const captchaValid = await this.service.imageCaptchaService.verifyCaptcha({ captcha, token: captcha_token });
    if (!captchaValid) {
      ctx.throwError('验证码不正确', 'F400');
      return;
    }

    const steps = [];
    const { SMS, OTP, EMAIL } = await this.service.base.operatorService.operatorVerify(operator);

    // 登陆是否安全验证
    if (SMS || OTP || EMAIL) {
      steps.push('identity-verify');
    }

    const authData = await ctx.createAuthData({
      id: operator.operator_no,
      sessionName: SESSION_NAME,
      loginName: login_name,
      orgAppNo: orgApp.app_no,
      orgNo: org.org_no,
      steps,
    });

    ctx.formatSuccessResp({
      data: authData.toResp(),
    });

    logger.info(`用户 ${login_name} 修改密码授权申请 成功`);
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/operator/forget-password/update-password 忘记密码-更新密码
   *
   * @apiDescription 忘记密码-更新密码
   *
   * @apiGroup ForgetPassword
   *
   * @apiParam  {String} password 密码(md5格式)
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiError (失败) {String} F401 未授权
   *
   * @apiSampleRequest /api/base/v1/operator/forget-password/update-password
   *
   */

  async updatePassword() {
    const { ctx, logger } = this;
    const { authData } = ctx;
    const { password } = ctx.request.body;
    const operatorNo = authData.id;
    await this.service.base.operatorService.resetPassword({ operatorNo, password });

    logger.info(`用户: ${operatorNo} 忘记密码重置成功`);

    ctx.formatSuccessResp();
  }
};
