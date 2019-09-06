'use strict';

const Controller = require('egg').Controller;

module.exports = class OrgController extends Controller {

  static route(app, middlewares, controller) {
    const { get } = app.router;

    get('/api/base/v1/org/list',
      middlewares.accessToken(),
      controller.list);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/org/list Org列表
   *
   * @apiDescription Org列表
   *
   * @apiGroup Org
   *
   * @apiParam  {String} [belongToOrg] 直属组织号
   * @apiParam  {String} [email] 邮箱
   * @apiParam  {String} [mobile] 手机号
   * @apiParam  {String} [name] 名称
   * @apiParam  {String} [nickName] 昵称
   * @apiParam  {String} [ownToOrg] 隶属组织号
   * @apiParam  {String} [type] 组织类型
   * @apiParam  {String} [status] 组织状态
   * @apiParam  {String} pageNo 页码
   * @apiParam  {String} pageSize 每页显示数量
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/org/list
   *
   */
  async list() {
    const { ctx, logger, service } = this;
    const { pageNo, pageSize } = ctx.query;

    logger.info(`Org列表查询开始 》》》》》,request:${JSON.stringify(ctx.query)}`);

    if (!pageNo || !pageSize) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.query)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const data = await service.gameAdminService.curl('/v1/game-admin/organization/list', {
      data: ctx.query,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`Org列表查询结束 》》》》》,response:${JSON.stringify(data)}`);
  }

};

