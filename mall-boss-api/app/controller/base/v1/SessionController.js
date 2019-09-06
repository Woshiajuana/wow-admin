'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const ms = require('ms');

const SESSION_NAME = 'login';

module.exports = class SessionController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/base/v1/session/authorization',
      controller.authorization);

    post('/api/base/v1/session/login-verify',
      middlewares.authToken({ module: 'verify_login_pwd' }),
      controller.loginVerify);

    post('/api/base/v1/session/login-complete',
      middlewares.authToken({
        module: 'login_complete',
        sessionName: SESSION_NAME,
        isEnd: true,
      }),
      middlewares.logger({ group: '会话', name: '登陆成功', level: 0 }),
      controller.loginComplete);

    post('/api/base/v1/session/logout',
      middlewares.accessToken(),
      middlewares.logger({ group: '会话', name: '退出登陆', level: 0, when: 'before' }),
      controller.logout);

    get('/api/base/v1/session/info',
      middlewares.accessToken(),
      controller.info);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/session/authorization 登录授权
   *
   * @apiDescription 登录授权
   *
   * @apiGroup Session
   *
   * @apiParam  {String} login_name 用户名
   * @apiParam  {String} domain 应用域名
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.is_need_captcha
   * @apiSuccess (成功) {Object} data.session_name
   * @apiSuccess (成功) {Object} data.auth_token
   * @apiSuccess (成功) {Object} data.auth_next_step
   * @apiSuccess (成功) {Object} data.auth_max_age
   *
   * @apiSampleRequest /api/base/v1/session/authorization
   *
   */
  async authorization() {
    const { ctx, logger, config } = this;
    const { helper } = ctx;
    let loginName = ctx.request.body.login_name || '';
    const { domain } = ctx.request.body;

    if (loginName) {
      loginName = loginName.toLowerCase();
    }

    if (!loginName) {
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
      ctx.throwError(`${domain} Org不存在错误`, 'F400');
      return;
    }

    const operator = await this.service.base.operatorService.findByLoginName({ loginName, appNo: orgApp.app_no });
    if (!operator) {
      ctx.throwError(`该账户 ${loginName} 不存在`);
    }

    if (operator.lock_status === 'lock') {
      logger.info(`该账户 ${loginName} 已经被被锁定, 请联系管理员`);
      ctx.throwError(`该账户 ${loginName} 已经被被锁定, 请联系管理员`);
      return;
    }

    if (operator.status === 'disabled') {
      logger.info(`该账户 ${loginName} 已经被停用, 请联系管理员`);
      ctx.throwError(`该账户 ${loginName} 已经被停用, 请联系管理员`);
      return;
    }

    const appConfigObj = await this.service.base.appConfigService.findAppConfigObjByCondition({ app_no: operator.app_no });
    const { system = {} } = appConfigObj;
    // 登陆是否打开验证码
    const loginNeedCaptcha = this.config.ImageCaptchaService.loginNeedCaptcha;
    const fixFn = data => data === true || data === '1';
    const isImageCaptcha = helper.hasTake([ system.isImageCaptcha, loginNeedCaptcha ], fixFn);

    const { SMS, OTP, EMAIL } = await this.service.base.operatorService.operatorVerify(operator, system);

    const steps = [ 'verify_login_pwd' ];

    // 登陆是否安全验证
    if (SMS || OTP || EMAIL) {
      steps.push('identity-verify');
    }

    const authData = await ctx.createAuthData({
      id: operator.operator_no,
      sessionName: SESSION_NAME,
      loginNeedCaptcha: isImageCaptcha,
      loginName,
      orgAppNo: orgApp.app_no,
      orgNo: org.org_no,
      steps,
    });

    ctx.formatSuccessResp({
      data: {
        ...authData.toResp(),
        is_need_captcha: loginNeedCaptcha,
      },
    });

    logger.info(`用户 ${loginName} 登录授权申请 成功`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/session/login-verify 登录密码验证
   *
   * @apiDescription 登录密码验证
   *
   * @apiGroup Session
   *
   * @apiParam {string} auth_token 输入auth_token
   * @apiParam  {String} login_name 用户名(user_name,mobile,email)
   * @apiParam  {String} password 密码(md5格式)
   * @apiParam  {String} captcha 验证码
   * @apiParam  {String} captcha_token 验证码token
   *
   * @apiError (失败) {String} F401 未授权
   * @apiError (失败) {String} F401-1 页面已过期，请关闭后重新再试
   * @apiError (失败) {String} F429 频繁请求，请稍后尝试
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.session_name
   * @apiSuccess (成功) {Object} data.auth_token
   * @apiSuccess (成功) {Object} data.auth_next_step
   * @apiSuccess (成功) {Object} data.auth_max_age
   *
   * @apiSampleRequest /api/base/v1/session/login-verify
   *
   */
  async loginVerify() {
    const { ctx, logger } = this;
    const { authData } = ctx;
    const { login_name, password, captcha, captcha_token } = ctx.request.body;

    const loginNeedCaptcha = authData.loginNeedCaptcha;

    if (loginNeedCaptcha) {
      if (!captcha || !captcha_token) {
        ctx.throwError('验证码不能为空', 'F400');
        return;
      }

      const captchaValid = await this.service.imageCaptchaService.verifyCaptcha({ captcha, token: captcha_token });
      if (!captchaValid) {
        ctx.throwError('验证码不正确', 'F400');
        return;
      }
    }

    const operator = await this.service.base.sessionService.loginPassword({ login_name, password });

    const role = await this.service.base.roleService.findRoleByRoleNo(operator.role_no);

    if (role.status === 'disabled') {
      logger.info(`该账户 ${login_name} 所属角色已经被停用, 请联系管理员`);
      ctx.throwError(`该账户 ${login_name} 所属角色已经被停用, 请联系管理员`);
      return;
    }

    if (loginNeedCaptcha) {
      await this.service.imageCaptchaService.invalidCaptcha(captcha_token);
    }

    ctx.formatSuccessResp();

    logger.info(`用户 ${authData.id} 密码校验通过`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/session/login-complete 登录完成
   *
   * @apiDescription 登录完成
   *
   * @apiGroup Session
   *
   * @apiParam  {String} auth_token auth_token
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.access_token
   * @apiSuccess (成功) {Object} data.access_random
   *
   * @apiSampleRequest /api/base/v1/session/login-complete
   *
   */
  async loginComplete() {
    const { ctx, logger, service, config } = this;
    const { authData } = ctx;
    const { maxUserLoginCount } = config;

    // 踢掉其他登陆用户
    await service.base.sessionService.kickOffUser(authData.id, maxUserLoginCount);

    const operator = await service.base.operatorService.findByOperatorNo(authData.id);
    const { menu, perm } = await service.base.menuService.findMenuAndPerm(operator.role_no);
    const role = await service.base.roleService.findRoleByRoleNo(operator.role_no);

    const orgApp = await service.base.appService.findOrgAppByCondition({ app_no: authData.orgAppNo });
    const org = await service.base.orgService.findOrgByOrgNo({ orgNo: authData.orgNo });

    const accessData = await ctx.createAccessData({
      id: authData.id,
      app: orgApp,
      org,
      role,
      operator: {
        ...operator.toJSON(),
        password: '*',
        otp_key: operator.otp_key ? '*' : '',
      },
      menu,
      perm,
    });

    ctx.response.set('set-access-token', accessData.accessToken);
    ctx.accessData = accessData;

    ctx.formatSuccessResp({
      data: {
        access_token: accessData.accessToken,
        access_random: accessData.random,
        access_max_age: accessData.maxAge,
        operator: accessData.operator,
        app: orgApp,
        org,
      },
    });

    logger.info(`用户: ${accessData.id} 登录成功 token: ${accessData.accessToken} ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/session/logout 登出
   *
   * @apiDescription 登出
   *
   * 验收条件：
   *
   * + 用户的session被清除，再次访问其他登录api返回 F401未授权
   *
   * @apiGroup Session
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/session/logout
   *
   */
  async logout() {
    const { ctx, logger } = this;
    const { accessData } = ctx;

    await ctx.destroyAccessData(accessData.accessToken);

    ctx.formatSuccessResp();

    logger.info(`operator_id: ${accessData.id} 登出!`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/session/info 登录信息
   * @apiDescription 登录信息
   *
   * @apiGroup Session
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.user_id
   * @apiSuccess (成功) {Object} data.access_token
   * @apiSuccess (成功) {Object} data.access_random
   *
   * @apiSampleRequest /api/base/v1/session/info
   *
   */
  async info() {
    const { ctx, logger } = this;
    const { accessData } = ctx;

    ctx.formatSuccessResp({ data: accessData.toJSON() });

    logger.info(`user_id: ${accessData.id} 获取用户登录状态`);
  }

};
