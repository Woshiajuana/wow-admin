'use strict';

const Controller = require('egg').Controller;

module.exports = class YoukiController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get, all } = app.router;

    post('/api/v1/youki/shareProfit/list',
      controller.shareProfitList);

    post('/api/v1/youki/shareProfit/sum',
      controller.shareProfitSum);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/youki/shareProfit/list youki分润列表
   *
   * @apiDescription youki分润列表
   *
   * @apiGroup Other
   *
   * @apiParam  {String} [orderNo] 订单号
   * @apiParam  {String} [userNo] 用户编号
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/youki/shareProfit/list
   *
   */

  async shareProfitList() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {}, helper } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, orderNo, userNo, pageNum, pageSize, startTime, endTime } = requestData;

    logger.info(`platformNo: ${platformNo} 查询 youki分润列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryProfitList', {
      method: 'post',
      data: {
        platformNo: 'P001',
        orderNo,
        userNo,

        pageNum,
        pageSize,
        startTime,
        endTime,
      },
    });

    ctx.formatSuccessResp({ data });
    logger.info(`platformNo: ${platformNo} 查询 youki分润列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/youki/shareProfit/sum youki分润汇总
   *
   * @apiDescription youki分润汇总
   *
   * @apiGroup Other
   *
   * @apiParam  {String} userNo 用户编号
   *
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/youki/shareProfit/sum
   *
   */

  async shareProfitSum() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {}, helper } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { userNo, startTime, endTime } = requestData;

    const verifyRules = {
      userNo: { type: 'string', message: '用户编号不能为空' },
    };
    ctx.validate(verifyRules, requestData);

    logger.info(`userId: ${accessData.id} 查询 youki分润汇总 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryProfitSum', {
      method: 'post',
      data: {
        platformNo: 'P001',
        userNo,

        startTime,
        endTime,
      },
    });

    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 youki分润汇总 成功！ ip: ${ctx.ip}`);
  }

};

