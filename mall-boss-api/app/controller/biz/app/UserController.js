'use strict';

const Controller = require('egg').Controller;

module.exports = class TradeController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/app/user/info',
      middlewares.accessToken(),
      controller.info);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/user/info 用户信息
   *
   * @apiDescription 用户信息
   *
   * @apiGroup App-User
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/user/info
   *
   */

  async info() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, pfUserToken, userNo } = accessData;
    const { } = requestData;

    const params = {
      platformNo,
      pfUserToken,
      userNo,
    };

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} 查询 用户信息 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/queryPfUserInfo', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} 查询 用户信息 成功！ ip: ${ctx.ip}`);
  }
};

