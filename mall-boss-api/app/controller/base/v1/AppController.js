'use strict';

const Controller = require('egg').Controller;

module.exports = class AppController extends Controller {

  static route(app, middlewares, controller) {
    const { get } = app.router;

    get('/api/base/v1/app/info',
      controller.info);

    get('/api/base/v1/app/list',
      middlewares.accessToken(),
      controller.list);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/app/info App信息
   *
   * @apiDescription App信息 主要用于用户登陆前获取App信息
   *
   * @apiGroup AppData
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/app/info
   *
   */

  async info() {
    const { ctx, logger, service } = this;
    const { helper } = ctx;
    const { referer, origin } = ctx.request.header;
    const { domain } = ctx.query;
    // 从引用页和来源页取地址
    // todo 这个建议client传递，不然不好控制

    if (!referer && !origin) {
      ctx.throwError('系统繁忙请稍后再试!');
      return;
    }

    const refererDomain = referer ? referer.split('/')[2] : '';
    const originDomain = origin ? origin.split('/')[2] : '';

    const targetDomain = domain || refererDomain || originDomain;

    const orgApp = await service.base.appService.findOrgAppByCondition({ domain: targetDomain });

    if (!orgApp) {
      ctx.throwError(`${targetDomain} App不存在`, 'F400');
      return;
    }

    const { name, logo, desc, theme, icp, app_info } = orgApp;

    let appInfo = {};
    let appInfoError;
    try {
      appInfo = app_info ? JSON.parse(app_info) : {};
    } catch (error) {
      appInfo = {};
      appInfoError = 'app_info Json 格式错误';
    }

    const loginNeedCaptcha = this.config.ImageCaptchaService.loginNeedCaptcha;

    const appConfigObj = await this.service.base.appConfigService.findAppConfigObjByCondition({ app_no: orgApp.app_no });
    const { system = {} } = appConfigObj;
    // 如果未定义不存在，那么直接返回undefined，key不出现
    const fixFn = data => {
      return data === true || data === '1';
    };
    // 这里在登陆页返回，方便根据全局配置来写登陆页面
    const appConfig = {
      system: {
        isImageCaptcha: helper.hasTake([ system.isImageCaptcha, loginNeedCaptcha ], fixFn),
        isSms: helper.hasTake([ system.isSms ], fixFn),
        isOtp: helper.hasTake([ system.isOtp ], fixFn),
        isEmail: helper.hasTake([ system.isEmail ], fixFn),
      },
    };

    const data = { name, logo, desc, theme, icp, appInfo, appInfoError, appConfig };

    ctx.formatSuccessResp({ data });

    logger.info(`${targetDomain} 获取 App信息成功!`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/app/list App列表
   *
   * @apiDescription App列表 用于org查看所拥有的app列表
   *
   * @apiGroup App
   *
   * @apiParam  {String} orgNo orgNo
   *
   * @apiParam  {String} [pageNo] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/app/list
   *
   */

  async list() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { app } = accessData;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { appNo, orgNo, belongToOrg, category, appCode, type, name, logo, desc, theme, icp, appInfo, status, pageNo, pageSize, startTime, endTime } = requestData;

    logger.info(`用户: ${accessData.id} 查询app列表 开始!`);

    if (belongToOrg) {
      if (belongToOrg !== app.belong_to_org) {
        logger.info(`用户: ${accessData.id} 所传belongToOrg跟自身app_no所属的belong_to_org不一致 操作拒绝!`);
        ctx.throwError(`无权查看 org: ${belongToOrg} 下 app数据`, 'F400');
        return;
      }
    }

    const offset = (pageNo - 1) * pageSize;
    const limit = Number.parseInt(pageSize);

    const modelData = {
      app_no: appNo,
      org_no: orgNo,
      belong_to_org: belongToOrg || app.belong_to_org,
      category,
      app_code: appCode,
      type,
      name,
      logo,
      desc,
      theme,
      icp,
      app_info: appInfo,
      status,
      startTime,
      endTime,
      offset,
      limit,
    };

    const result = await this.service.base.appService.list(modelData);

    result.list = helper.toHump(result.list, true);

    const data = helper.toExportList({
      count: result.count,
      list: result.list,
      title: 'APP列表',
    });

    logger.info(`用户: ${accessData.id} 查询app列表 成功!`);
    ctx.formatSuccessResp({ data });
  }
};

