'use strict';

const Controller = require('egg').Controller;

const SESSION_NAME = 'modify-password';

module.exports = class ModifyPasswordController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    post('/api/base/v1/operator/modify-password/authorization',
      middlewares.accessToken(),
      controller.authorization);

    post('/api/base/v1/operator/modify-password/update-password',
      middlewares.accessToken(),
      middlewares.authToken({ sessionName: SESSION_NAME, isEnd: true }),
      middlewares.logger({ group: '操作员', name: '修改密码', level: 0 }),
      controller.updatePassword);
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/operator/modify-password/authorization 修改密码授权申请
   *
   * @apiDescription 修改密码授权申请
   *
   * @apiGroup ModifyPassword
   *
   * @apiParam  {String} accessToken accessToken
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiError (失败) {String} F401 未授权
   *
   * @apiSampleRequest /api/base/v1/operator/modify-password/authorization
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

    const login_name = accessData.operator.user_name;
    const authData = await ctx.createAuthData({
      id: accessData.operator.operator_no,
      sessionName: SESSION_NAME,
      loginName: login_name,
      orgAppNo: accessData.app.app_no,
      orgNo: accessData.app.org_no,
      steps,
    });

    ctx.formatSuccessResp({
      data: authData.toResp(),
    });

    logger.info(`用户 ${login_name} 修改密码授权申请 成功`);
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/operator/modify-password/update-password 修改密码-更新密码
   *
   * @apiDescription 修改密码-更新密码
   *
   * @apiGroup ModifyPassword
   *
   * @apiParam  {String} accessToken accessToken
   * @apiParam  {String} password 密码(md5格式)
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiError (失败) {String} F401 未授权
   *
   * @apiSampleRequest /api/base/v1/operator/modify-password/update-password
   *
   */


  async updatePassword() {
    const { ctx, logger } = this;
    const { authData } = ctx;
    const { password } = ctx.request.body;
    const operatorNo = authData.id;
    await this.service.base.operatorService.modifyPassword({ operatorNo, password });

    await this.service.base.sessionService.kickOffUser(authData.id);

    logger.info(`用户: ${operatorNo} 修改密码成功`);

    ctx.formatSuccessResp();
  }
};
