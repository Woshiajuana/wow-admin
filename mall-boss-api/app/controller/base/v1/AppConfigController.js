'use strict';

const Controller = require('egg').Controller;

module.exports = class AppConfigController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    get('/api/base/v1/app-config/list',
      middlewares.accessToken(),
      controller.list);

    get('/api/base/v1/app-config/query',
      middlewares.accessToken(),
      controller.query);

    post('/api/base/v1/app-config/create',
      middlewares.accessToken(),
      controller.create);

    post('/api/base/v1/app-config/update',
      middlewares.accessToken(),
      controller.update);

    post('/api/base/v1/app-config/delete',
      middlewares.accessToken(),
      controller.delete);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/app-config/list app config 列表
   *
   * @apiDescription 获取app config 字典列表
   *
   * @apiGroup AppConfig
   *
   * @apiParam  {String} [appNo] appNo
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
   * @apiSampleRequest /api/base/v1/app-config/list
   *
   */

  async list() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { app } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { appNo, category, key, value, desc, status, pageNo, pageSize, startTime, endTime } = requestData;

    logger.info(`用户: ${accessData.id} 查询字典列表 开始!`);

    if (appNo) {
      logger.info(`用户: ${accessData.id} 验证所传app_no是否跟自身app_no具有同一个直系上级`);
      const orgApp = await this.service.base.appService.findOrgAppByCondition({ app_no: appNo });
      if (!orgApp) {
        logger.info(`用户: ${accessData.id} app_no ${appNo} 不存在!`);
        ctx.throwError(`${appNo} 不存在`, 'F400');
        return;
      }
      if (orgApp.belong_to_org !== app.belong_to_org) {
        logger.info(`用户: ${accessData.id} 所传app_no跟自身app_no不具有同一个直系上级! 操作拒绝!`);
        ctx.throwError(`无权查看 app: ${appNo} 数据`, 'F400');
        return;
      }
    }

    const offset = (pageNo - 1) * pageSize;
    const limit = Number.parseInt(pageSize);

    const modelData = {
      app_no: appNo || app.app_no,
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

    const result = await this.service.base.appConfigService.list(modelData);

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
   * @api {get} /api/base/v1/app-config/query 字典项查询
   *
   * @apiDescription 字典项查询
   *
   * @apiGroup AppConfig
   *
   * @apiParam  {String} [appNo] appNo
   * @apiParam  {String} category 分类
   * @apiParam  {String} key key
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/app-config/query
   *
   */

  async query() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { app } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { appNo, category, key, status = 'normal' } = requestData;

    logger.info(`用户: ${accessData.id} 查询字典项 开始!`);

    if (!key) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const modelData = {
      app_no: appNo || app.app_no,
      category,
      key,
      status,
    };

    const data = await this.service.base.appConfigService.query(modelData);

    logger.info(`用户: ${accessData.id} 查询字典项 成功!`);
    ctx.formatSuccessResp({ data });

  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/app-config/create 字典项创建
   *
   * @apiDescription 字典项创建
   *
   * @apiGroup AppConfig
   *
   * @apiParam  {String} [appNo] appNo
   * @apiParam  {String} [category] 分类
   * @apiParam  {String} key key
   * @apiParam  {String} value value
   * @apiParam  {String} [desc] 描述
   * @apiParam  {String} [status] 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/app-config/create
   *
   */

  async create() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { app } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { appNo, category, key, value, desc, status = 'normal' } = requestData;

    logger.info(`用户: ${accessData.id} 创建字典项 开始!`);

    if (!key || !value) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    if (appNo) {
      logger.info(`用户: ${accessData.id} 验证所传app_no是否跟自身app_no具有同一个直系上级`);
      const orgApp = await this.service.base.appService.findOrgAppByCondition({ app_no: appNo });
      if (!orgApp) {
        logger.info(`用户: ${accessData.id} app_no ${appNo} 不存在!`);
        ctx.throwError(`${appNo} 不存在`, 'F400');
        return;
      }
      if (orgApp.belong_to_org !== app.belong_to_org) {
        logger.info(`用户: ${accessData.id} 所传app_no跟自身app_no不具有同一个直系上级! 操作拒绝!`);
        ctx.throwError(`无权创建 app: ${appNo} 数据`, 'F400');
        return;
      }
    }

    const modelData = {
      app_no: appNo || app.app_no,
      category,
      key,
      value,
      desc,
      status,
    };

    const data = await this.service.base.appConfigService.create(modelData);

    logger.info(`用户: ${accessData.id} 创建字典项 成功!`);
    ctx.formatSuccessResp({ data });
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/app-config/update 字典项更新
   *
   * @apiDescription 字典项更新
   *
   * @apiGroup AppConfig
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
   * @apiSampleRequest /api/base/v1/app-config/update
   *
   */

  async update() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { app } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { id, appNo, category, key, value, desc, status } = requestData;

    logger.info(`用户: ${accessData.id} 更新字典项 开始!`);

    if (!id) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)} id 不能为空`);
      ctx.throwError('id 不能为空');
      return;
    }

    const record = await this.service.base.appConfigService.query({ id, app_no: appNo });
    if (!record) {
      logger.info(`用户: ${accessData.id} 该条记录不存在!`);
      ctx.throwError('记录不存在', 'F400');
      return;
    }

    if (appNo) {
      logger.info(`用户: ${accessData.id} 验证所传app_no是否跟自身app_no具有同一个直系上级`);
      const orgApp = await this.service.base.appService.findOrgAppByCondition({ app_no: appNo });
      if (!orgApp) {
        logger.info(`用户: ${accessData.id} app_no ${appNo} 不存在!`);
        ctx.throwError(`${appNo} 不存在`, 'F400');
        return;
      }
      if (orgApp.belong_to_org !== app.belong_to_org) {
        logger.info(`用户: ${accessData.id} 所传app_no跟自身app_no不具有同一个直系上级! 操作拒绝!`);
        ctx.throwError(`无权更新 app: ${appNo} 数据`, 'F400');
        return;
      }
    }

    const modelData = {
      id,
      app_no: appNo || app.app_no,
      category,
      key,
      value,
      desc,
      status,
    };

    const data = await this.service.base.appConfigService.update(modelData);

    logger.info(`用户: ${accessData.id} 更新字典项 成功!`);
    ctx.formatSuccessResp({ data });
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/app-config/delete 字典项删除
   *
   * @apiDescription 字典项删除
   *
   * @apiGroup AppConfig
   *
   * @apiParam  {String} id id
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/app-config/delete
   *
   */

  async delete() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { app } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { id, appNo } = requestData;

    logger.info(`用户: ${accessData.id} 删除字典项 开始!`);

    if (!id) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(requestData)} id 不能为空`);
      ctx.throwError('id 不能为空');
      return;
    }

    const record = await this.service.base.appConfigService.query({ id, app_no: appNo });
    if (!record) {
      logger.info(`用户: ${accessData.id} 该条记录不存在!`);
      ctx.throwError('记录不存在', 'F400');
      return;
    }

    if (appNo) {
      logger.info(`用户: ${accessData.id} 验证所传app_no是否跟自身app_no具有同一个直系上级`);
      const orgApp = await this.service.base.appService.findOrgAppByCondition({ app_no: appNo });
      if (!orgApp) {
        logger.info(`用户: ${accessData.id} app_no ${appNo} 不存在!`);
        ctx.throwError(`${appNo} 不存在`, 'F400');
        return;
      }
      if (orgApp.belong_to_org !== app.belong_to_org) {
        logger.info(`用户: ${accessData.id} 所传app_no跟自身app_no不具有同一个直系上级! 操作拒绝!`);
        ctx.throwError(`无权删除 app: ${appNo} 数据`, 'F400');
        return;
      }
    }

    const modelData = {
      id,
      app_no: appNo || app.app_no,
    };
    const data = await this.service.base.appConfigService.delete(modelData);

    logger.info(`用户: ${accessData.id} 删除字典项 成功!`);
    ctx.formatSuccessResp({ data });
  }
};

