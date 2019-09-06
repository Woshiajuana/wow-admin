'use strict';

const Controller = require('egg').Controller;

module.exports = class MenuController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    get('/api/base/v1/logger/list',
      middlewares.accessToken(),
      controller.list);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/logger/list 操作日志列表
   *
   * @apiDescription 操作日志列表
   *
   * @apiGroup Operator
   *
   * @apiParam  {String} pageNo 页码
   * @apiParam  {String} pageSize 数量
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/logger/list
   *
   */

  async list() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { pageNo, pageSize, startTime, endTime, operatorName, operatorIp, sessionToken, actionGroupName, actionName, scuityLevel } = ctx.query;

    logger.info('开始获取操作日志列表》》》》》');

    if (!pageNo || !pageSize || !startTime || !endTime) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.query)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const offset = (pageNo - 1) * pageSize;

    const limit = Number.parseInt(pageSize);

    const logList = await service.base.loggerService.list(accessData.app.app_no, offset, limit, startTime, endTime, operatorName, operatorIp, sessionToken, actionGroupName, actionName, scuityLevel);
    logList.list = helper.toHump(logList.list, true);

    const data = helper.toExportList({
      count: logList.count,
      list: logList.list,
      title: '操作日志列表',
    });

    ctx.formatSuccessResp({ data });

    logger.info(`用户: ${accessData.id} 获取 操作日志列表 信息`);
  }
};
