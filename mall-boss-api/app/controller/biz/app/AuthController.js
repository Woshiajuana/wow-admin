'use strict';

const Controller = require('egg').Controller;

module.exports = class AuthController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/app/auth/login',
      controller.login);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/auth/login 授权登陆
   *
   * @apiDescription 授权登陆
   *
   * @apiGroup App-Auth
   *
   * @apiParam  {String} platformNo 平台编码
   * @apiParam  {String} pfUserToken  pfUserToken
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/auth/login
   *
   */

  async login() {
    const { ctx, app, logger, config, service } = this;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, platformName, pfUserToken } = requestData;

    if (!platformNo) {
      ctx.throwError('platformNo参数不能为空', 'F400');
      return;
    }

    if (!pfUserToken) {
      ctx.throwError('pfUserToken参数不能为空', 'F400');
      return;
    }

    logger.info(`platformNo: ${platformNo} 查询 app授权登陆 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/authLogin', {
      method: 'post',
      data: {
        platformNo,
        pfUserToken,
      },
    });

    // 干掉之前他的accesstoken
    await ctx.destroyAccessDatasByUserId(data.userNo, 5); // 最多登陆5台设备

    const accessData = await ctx.createAccessData({
      id: data.userNo,
      platformNo,
      pfUserToken,
      userNo: data.userNo,
      user: data,
    }, '72h'); // h5 有效时间

    ctx.response.set('set-access-token', accessData.accessToken);
    ctx.accessData = accessData;

    ctx.formatSuccessResp({
      data: {
        access_token: accessData.accessToken,
        access_random: accessData.random,
        access_max_age: accessData.maxAge,
      },
    });

    logger.info(`platformNo: ${platformNo} app授权登陆 成功！ ip: ${ctx.ip}`);
  }
};

