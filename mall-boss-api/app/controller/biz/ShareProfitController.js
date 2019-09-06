'use strict';

const Controller = require('egg').Controller;

module.exports = class ShareProfitController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get, all } = app.router;

    all('/api/v1/shareProfit/list',
      middlewares.accessToken(),
      controller.list);

    post('/api/v1/shareProfit/sum',
      middlewares.accessToken(),
      controller.sum);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shareProfit/list 分润列表
   *
   * @apiDescription 分润列表
   *
   * @apiGroup ShareProfit
   *
   * @apiParam  {String} [platformNo] 平台编号
   * @apiParam  {String} [shopNo] 店铺编号
   * @apiParam  {String} [orderNo] 订单编号
   * @apiParam  {String} [userPhone] 用户手机
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shareProfit/list
   *
   */

  async list() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {}, helper } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, shopNo, orderNo, userPhone, pageNum, pageSize, startTime, endTime } = requestData;

    logger.info(`userId: ${accessData.id} 查询 分润列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryProfitList', {
      method: 'post',
      data: {
        platformNo,
        shopNo,
        orderNo,
        userPhone,

        pageNum,
        pageSize,
        startTime,
        endTime,
      },
    });

    if (requestData.export) {
      const exportData = data.list || data.content || data;
      if (Object.prototype.toString.call(exportData) !== '[object Array]' || !exportData[0]) {
        ctx.throwError('缺少数据 导出失败', 'F400');
        return;
      }
      await service.base.utlis.excelService.export({
        count: exportData.length,
        list: exportData,
        header: this.config.exportHeader.shareProfitList,
      }, '分润列表');
      return;
    }

    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 分润列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shareProfit/sum 分润汇总
   *
   * @apiDescription 分润汇总
   *
   * @apiGroup ShareProfit
   *
   * @apiParam  {String} [platformNo] 平台编号
   * @apiParam  {String} [orderNo] 订单编号
   * @apiParam  {String} [userNo] 用户编号
   * @apiParam  {String} [shopNo] 店铺编号
   * @apiParam  {String} [userPhone] 用户手机
   * @apiParam  {String} [goodsNo] 商品编号
   *
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shareProfit/sum
   *
   */

  async sum() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {}, helper } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, orderNo, userNo, shopNo, userPhone, goodsNo, startTime, endTime } = requestData;

    logger.info(`userId: ${accessData.id} 查询 分润汇总 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryProfitSum', {
      method: 'post',
      data: {
        platformNo,
        orderNo,
        userNo,
        shopNo,
        userPhone,
        goodsNo,
        startTime,
        endTime,
      },
    });

    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 分润汇总 成功！ ip: ${ctx.ip}`);
  }

};

