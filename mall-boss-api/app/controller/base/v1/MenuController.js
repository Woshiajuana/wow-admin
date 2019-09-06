'use strict';

const Controller = require('egg').Controller;

module.exports = class MenuController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    get('/api/base/v1/menu/list',
      middlewares.accessToken(),
      controller.list);
    post('/api/base/v1/menu/modify',
      middlewares.accessToken(),
      controller.modify);
    post('/api/base/v1/menu/create',
      middlewares.accessToken(),
      controller.modify);
    post('/api/base/v1/menu/getById',
      middlewares.accessToken(),
      controller.modify);
    post('/api/base/v1/menu/delete',
      middlewares.accessToken(),
      controller.modify);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/role/list 角色列表
   *
   * @apiDescription 角色列表
   *
   * @apiGroup Role
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.operator
   * @apiSuccess (成功) {Object} data.menu
   * @apiSuccess (成功) {Object} data.perm
   *
   * @apiSampleRequest /api/base/v1/role/list
   *
   */
  async list() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const { operator } = accessData;

    logger.info(`用户:${accessData.id}获取菜单列表开始》》》》》》`);

    const { menu, perm } = await service.base.menuService.findMenuAndPerm(operator.role_no);

    ctx.formatSuccessResp({
      data: { menu, perm },
    });

    logger.info(`用户: ${accessData.id} 获取 获取菜单列表信息`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/role/modify 编辑角色
   *
   * @apiDescription 编辑角色
   *
   * @apiGroup Role
   *
   * @apiParam  {String} status 状态
   * @apiParam  {String} role_no 角色号
   * @apiParam  {Number} id ID
   * @apiParam  {String} name 名称
   * @apiParam  {String} desc 描述
   * @apiParam  {String} category 类别
   * @apiParam  {String} app_no app号
   * @apiParam  {String} org_no 组织机构号
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {Object} data.operator
   * @apiSuccess (成功) {Object} data.menu
   * @apiSuccess (成功) {Object} data.perm
   *
   * @apiSampleRequest /api/base/v1/role/modify
   *
   */
  async modify() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const { role_no, id, app_no, org_no } = ctx.query;

    if (!id || !role_no || !app_no || !org_no) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.query)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const data = await service.base.menuService.curl('/v1/game-admin/role/modify', {
      data: ctx.query,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`用户: ${accessData.id} 获取 编辑角色信息完成`);
  }
};
