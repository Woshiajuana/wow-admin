'use strict';

const Controller = require('egg').Controller;

module.exports = class TradeController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/app/trade/order/create',
      middlewares.accessToken(),
      controller.orderCreate);

    post('/api/v1/app/trade/order/list',
      middlewares.accessToken(),
      controller.orderList);

    post('/api/v1/app/trade/order/query',
      middlewares.accessToken(),
      controller.orderQuery);

    post('/api/v1/app/trade/order/delete',
      middlewares.accessToken(),
      controller.orderDelete);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/trade/order/create 用户商品下单
   *
   * @apiDescription 用户商品下单
   *
   * @apiGroup App-Trade
   *
   * @apiParam  {String} goodsNo 商品编号
   * @apiParam  {String} [goodsNorms] 商品规格
   * @apiParam  {String} [goodsDiscountPrice] 商品折扣价 （分）
   * @apiParam  {String} tradeBuyNum 购买商品数量
   * @apiParam  {String} [tradeAmt] 交易金额（分）
   * @apiParam  {String} [tradePoints] 交易积分
   * @apiParam  {String} [tradeBalance]  交易余额
   * @apiParam  {String} [freightAmt]  运费（分）
   * @apiParam  {String{1、使用积分支付 2、非使用积分支付}} isPointsPay  是否使用积分支付
   * @apiParam  {String{1、使用余额支付 2、非使用余额支付}} [isBalance]  是否使用余额支付
   * @apiParam  {String{alipay 支付宝 weChat 微信 unionPay 银联支付}} payWay  支付方式
   * @apiParam  {String} addressId  收货地址
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/trade/order/create
   *
   */

  async orderCreate() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, pfUserToken, userNo } = accessData;
    const {
      goodsNo,
      goodsNorms,
      goodsDiscountPrice,
      tradeBuyNum,
      tradeAmt,
      tradePoints,
      tradeBalance,
      freightAmt,
      isPointsPay,
      isBalance,
      payWay,
      addressId } = requestData;

    const params = {
      platformNo,
      pfUserToken,
      userNo,

      goodsNo,
      goodsNorms,
      goodsDiscountPrice,
      tradeBuyNum,
      tradeAmt,
      tradePoints,
      tradeBalance,
      freightAmt,
      isPointsPay,
      isBalance,
      payWay,
      addressId,
    };

    const verifyRules = {
      goodsNo: true,
      tradeBuyNum: true,
      isPointsPay: true,
      payWay: true,
      addressId: true,
    };
    ctx.validate(verifyRules, requestData);

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} app用户商品下单 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/createOrder', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} app用户商品下单 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/trade/order/list 用户订单列表
   *
   * @apiDescription 用户订单列表
   *
   * @apiGroup App-Trade
   *
   *
   * @apiParam  {String} [goodsName] 商品名称
   * @apiParam  {String} [orderStatus] 订单状态
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   *
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/trade/order/list
   *
   */

  async orderList() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, pfUserToken, userNo } = accessData;
    const {
      goodsName,
      orderStatus,
      pageNum,
      pageSize,
      startTime,
      endTime,
    } = requestData;

    const params = {
      platformNo,
      userNo,

      goodsName,
      orderStatus,
      status: 'normal',
      pageNum,
      pageSize,
      startTime,
      endTime,
    };

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} 获取 app 用户订单列表 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/queryOrderList', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} 获取 app 用户订单列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/trade/order/query 用户订单详情
   *
   * @apiDescription 用户订单详情
   *
   * @apiGroup App-Trade
   *
   * @apiParam  {String} orderNo 订单号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/trade/order/query
   *
   */

  async orderQuery() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, pfUserToken, userNo } = accessData;
    const { orderNo } = requestData;

    const params = {
      orderNo,
    };

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} 获取 app 用户订单详情 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/queryOrderNo', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} 获取 app 用户订单详情 成功！ ip: ${ctx.ip}`);
  }
  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/trade/order/delete 用户订单删除
   *
   * @apiDescription 用户订单删除
   *
   * @apiGroup App-Trade
   *
   * @apiParam  {String} orderNo 订单号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/trade/order/delete
   *
   */

  async orderDelete() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, pfUserToken, userNo } = accessData;
    const { orderNo } = requestData;

    const params = {
      orderNo,
    };

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} app 用户订单删除 开始>>>>${JSON.stringify(requestData)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/delOrderNo', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`platformNo: ${platformNo} userNo: ${accessData.id} app 用户订单删除 成功！ ip: ${ctx.ip}`);
  }
};

