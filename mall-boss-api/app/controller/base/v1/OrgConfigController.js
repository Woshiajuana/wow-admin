'use strict';

const Controller = require('egg').Controller;

module.exports = class OrgConfigController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    get('/api/base/v1/org-config/list',
      middlewares.accessToken(),
      controller.list);

    get('/api/base/v1/org-config/query',
      middlewares.accessToken(),
      controller.query);

    post('/api/base/v1/org-config/create',
      middlewares.accessToken(),
      controller.create);

    post('/api/base/v1/org-config/update',
      middlewares.accessToken(),
      controller.update);

    post('/api/base/v1/org-config/delete',
      middlewares.accessToken(),
      controller.delete);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/org-config/list org config 列表
   *
   * @apiDescription 获取org config 字典列表
   *
   * @apiGroup OrgConfig
   *
   * @apiParam  {String} [category] 分类
   * @apiParam  {String} [key] key
   * @apiParam  {String} [value] value
   * @apiParam  {String} [desc] 描述
   * @apiParam  {String} [status] 状态
   *
   * @apiParam  {String} [pageNo] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/org-config/list
   *
   */

  async list() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { org } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { category, key, value, desc, status, pageNo, pageSize, startTime, endTime } = requestData;

    logger.info(`用户: ${accessData.id} 查询字典列表 开始!`);

    if (!pageNo || !pageSize) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const offset = (pageNo - 1) * pageSize;
    const limit = Number.parseInt(pageSize);

    const modelData = {
      org_no: org.org_no,
      category,
      key,
      value,
      desc,
      status,
      startTime,
      endTime,
      offset,
      limit,
    };

    const result = await this.service.base.orgConfigService.list(modelData);

    result.list = helper.toHump(result.list, true);

    const data = helper.toExportList({
      count: result.count,
      list: result.list,
      title: 'APP字典列表',
    });

    logger.info(`用户: ${accessData.id} 查询字典列表 成功!`);
    ctx.formatSuccessResp({ data });

  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/org-config/query 字典项查询
   *
   * @apiDescription 字典项查询
   *
   * @apiGroup OrgConfig
   *
   * @apiParam  {String} category 分类
   * @apiParam  {String} key key
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/org-config/query
   *
   */

  async query() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { org } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { category, key, status = 'normal' } = requestData;

    logger.info(`用户: ${accessData.id} 查询字典项 开始!`);

    if (!key) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const modelData = {
      org_no: org.org_no,
      category,
      key,
      status,
    };

    const data = await this.service.base.orgConfigService.query(modelData);

    logger.info(`用户: ${accessData.id} 查询字典项 成功!`);
    ctx.formatSuccessResp({ data });

  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/org-config/create 字典项创建
   *
   * @apiDescription 字典项创建
   *
   * @apiGroup OrgConfig
   *
   * @apiParam  {String} [category] 分类
   * @apiParam  {String} key key
   * @apiParam  {String} value value
   * @apiParam  {String} [desc] 描述
   * @apiParam  {String} [status] 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/org-config/create
   *
   */

  async create() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { org } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { category, key, value, desc, status = 'normal' } = requestData;

    logger.info(`用户: ${accessData.id} 创建字典项 开始!`);

    if (!key) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const modelData = {
      org_no: org.org_no,
      category,
      key,
      value,
      desc,
      status,
    };

    const data = await this.service.base.orgConfigService.create(modelData);

    logger.info(`用户: ${accessData.id} 创建字典项 成功!`);
    ctx.formatSuccessResp({ data });
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/org-config/update 字典项更新
   *
   * @apiDescription 字典项更新
   *
   * @apiGroup OrgConfig
   *
   * @apiParam  {String} id id
   * @apiParam  {String} [category] 分类
   * @apiParam  {String} [key] key
   * @apiParam  {String} [value] value
   * @apiParam  {String} [desc] 描述
   * @apiParam  {String} [status] 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/org-config/update
   *
   */

  async update() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { org } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { id, category, key, value, desc, status } = requestData;

    logger.info(`用户: ${accessData.id} 更新字典项 开始!`);

    if (!id) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)} id 不能为空`);
      ctx.throwError('id 不能为空');
      return;
    }

    const modelData = {
      id,
      category,
      key,
      value,
      desc,
      status,
    };

    const data = await this.service.base.orgConfigService.update(modelData);

    logger.info(`用户: ${accessData.id} 更新字典项 成功!`);
    ctx.formatSuccessResp({ data });
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/org-config/delete 字典项删除
   *
   * @apiDescription 字典项删除
   *
   * @apiGroup OrgConfig
   *
   * @apiParam  {String} id id
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/org-config/delete
   *
   */

  async delete() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { org } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { id } = requestData;

    logger.info(`用户: ${accessData.id} 删除字典项 开始!`);

    if (!id) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)} id 不能为空`);
      ctx.throwError('id 不能为空');
      return;
    }

    const data = await this.service.base.orgConfigService.delete({ id });

    logger.info(`用户: ${accessData.id} 删除字典项 成功!`);
    ctx.formatSuccessResp({ data });
  }
};

