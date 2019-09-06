'use strict';

const Controller = require('egg').Controller;

module.exports = class GoodsController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/app/goods/list',
      middlewares.accessToken(),
      controller.appList);

    post('/api/v1/app/goods/query',
      middlewares.accessToken(),
      controller.appQuery);

    post('/api/v1/app/goods/recommend-goods',
      middlewares.accessToken(),
      controller.appRecommendGoods);

    post('/api/v1/app/goods/check-goods',
      middlewares.accessToken(),
      controller.appCheckGoods);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/goods/list app商品列表
   *
   * @apiDescription app商品列表 默认都是上架产品
   *
   * @apiGroup App-Goods
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/goods/list
   *
   */

  async appList() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { pageNum = '1', pageSize = '20', startTime, endTime } = requestData;

    logger.info(`userId: ${accessData.id} 查询 app商品列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryGoodsList', {
      method: 'post',
      data: {
        platformNo: accessData.platformNo,
        status: 'normal',
        pageNum,
        pageSize,
        startTime,
        endTime,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 app商品列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/goods/query app商品查询
   *
   * @apiDescription app商品查询
   *
   * @apiGroup App-Goods
   *
   * @apiParam  {String} goodsId 商品编号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/goods/query
   *
   */

  async appQuery() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { goodsId } = requestData;

    if (!goodsId) {
      logger.info(`goodsId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('goodsId不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 查询 app商品查询 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryGoodsByNo', {
      method: 'post',
      data: {
        goodsId,
      },
    });

    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 app商品查询 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/goods/recommend-goods app首页商品推荐
   *
   * @apiDescription app首页商品推荐
   *
   * @apiGroup App-Goods
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/goods/recommend-goods
   *
   */

  async appRecommendGoods() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { } = requestData;

    logger.info(`userId: ${accessData.id} 查询 app首页商品推荐 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/recommendGoods', {
      method: 'post',
      data: {
        platformNo: accessData.platformNo,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 app首页商品推荐 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/goods/check-goods app检查商品
   *
   * @apiDescription app检查商品
   *
   * @apiGroup App-Goods
   *
   * @apiParam  {String} goodsId 商品编号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/goods/check-goods
   *
   */

  async appCheckGoods() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { goodsId } = requestData;

    if (!goodsId) {
      logger.info(`goodsId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('goodsId不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 查询 app检查商品 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/checkGoods', {
      method: 'post',
      data: {
        goodsId,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 app检查商品 成功！ ip: ${ctx.ip}`);
  }
};

