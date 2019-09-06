'use strict';

const Controller = require('egg').Controller;

module.exports = class TradeController extends Controller {

  static route(app, middlewares, controller) {
    const { all, post, get } = app.router;

    all('/api/v1/trade/order/list',
      middlewares.accessToken(),
      controller.orderList);

    post('/api/v1/trade/order/query',
      middlewares.accessToken(),
      controller.orderQuery);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/trade/order/list 订单列表
   *
   * @apiDescription 订单列表
   *
   * @apiGroup Trade
   *
   * @apiParam  {String} [export] 导出模式
   *
   * @apiParam  {String} [platformNo] 平台编号
   * @apiParam  {String} [shopNo] 店铺编号
   * @apiParam  {String} [userNo] 用户编号
   * @apiParam  {String} [orderNo] 订单编号
   * @apiParam  {String} [userPhone] 用户手机
   * @apiParam  {String} [goodsName] 商品名称
   * @apiParam  {String} [orderStatus] 订单状态
   * @apiParam  {String{normal,disabled}} [status] 删除状态
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   *
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/trade/order/list
   *
   */

  async orderList() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { } = accessData;
    const {
      platformNo,
      shopNo,
      userNo,
      orderNo,
      userPhone,
      goodsName,
      orderStatus,
      status,
      pageNum,
      pageSize,
      startTime,
      endTime,
    } = requestData;

    const params = {
      platformNo,
      shopNo,
      userNo,
      orderNo,
      userPhone,
      goodsName,
      orderStatus,
      status,
      pageNum,
      pageSize,
      startTime,
      endTime,
    };

    logger.info(`operator: ${accessData.id} 获取 订单列表 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/queryOrderList', {
      method: 'post',
      data: params,
    });

    if (data[0] || data.list) { // 处理快递列表，转成字符串方便前端使用
      const listData = data.list || data.content || data;
      listData.filter(item => item.orderStatus == 5).forEach(item => {
        if (Object.prototype.toString.call(item.fastInfoList) !== '[object Array]') return;
        const fastInfos = [];
        item.fastInfoList.forEach(item => {
          fastInfos.push(item.fastCompany + '|' + item.fastNo);
        });
        item.fastInfo = fastInfos.join(',');
      });
    }

    if (requestData.export) {
      const exportData = data.list || data.content || data;
      if (Object.prototype.toString.call(exportData) !== '[object Array]' || !exportData[0]) {
        ctx.throwError('缺少数据 导出失败', 'F400');
        return;
      }
      await service.base.utlis.excelService.export({
        count: exportData.length,
        list: exportData,
        header: this.config.exportHeader.tradeList,
      }, '订单列表');
      return;
    }

    ctx.formatSuccessResp({ data });

    logger.info(`operator: ${accessData.id} 获取 订单列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/trade/order/query 订单详情
   *
   * @apiDescription 订单详情
   *
   * @apiGroup Trade
   *
   * @apiParam  {String} orderNo 订单号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/trade/order/query
   *
   */

  async orderQuery() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { } = accessData;
    const { orderNo } = requestData;

    const params = {
      orderNo,
    };

    logger.info(`operator: ${accessData.id} 获取 订单详情 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/queryOrderNo', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`operator: ${accessData.id} 获取 订单详情 成功！ ip: ${ctx.ip}`);
  }
};

