'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('mz/fs');

class FileController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/platform/list',
      middlewares.accessToken(),
      controller.list);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/platform/list 平台列表
   *
   * @apiDescription 平台列表
   *
   * @apiGroup Platform
   *
   * @apiParam  {String} [platformNo] 平台号
   * @apiParam  {String} [platformName] 平台名称
   * @apiParam  {String} [status] 状态
   *
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/platform/list
   *
   */

  async list() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, platformName, status, startTime, endTime } = requestData;

    logger.info(`userId: ${accessData.id} 查询 平台列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryPlatFrom', {
      method: 'post',
      data: {
        platformNo,
        platformName,
        status,
        startTime,
        endTime,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 平台列表 成功！ ip: ${ctx.ip}`);
  }
}

module.exports = FileController;
