'use strict';

const Controller = require('egg').Controller;

module.exports = class EnumController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post, all } = app.router;

    all('/api/v1/enum/*',
      middlewares.accessToken(),
      controller.enum);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/enum/* 获取业务枚举列表
   *
   * @apiDescription 枚举
   *
   * @apiGroup enum
   *
   * @apiParam  {String} [enumType] 枚举类型
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/enum/*
   *
   */
  async enum() {
    const { ctx, logger } = this;
    const { accessData } = ctx;
    const pathParams = ctx.params[0];

    let requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;

    // 返回是否对象格式映射
    const enumType = requestData.enumType;
    delete requestData.enumType;

    // 定义枚举取哪个key
    const enumKey = {
      data: 'data',
      name: 'name',
      code: 'code',
    };

    // 这里接口只支持列表
    const enumInfo = {
      shop: {
        service: 'scoreMallService', // 接口使用的服务
        path: '/v1/mall/queryShopList', // 请求地址
        data: 'list', // 目标列表数据的key
        name: 'shopName', // 这里可以覆盖enumKey默认值
        code: 'shopNo', // 方便根据不同的列表key作区分
      },
      platform: {
        service: 'scoreMallService',
        path: '/v1/mall/queryPlatFrom',
        data: 'list',
        name: 'platformName',
        code: 'platformNo',
      },
    };

    if (!enumInfo[pathParams]) {
      ctx.throwError('enum info获取失败!');
      logger.info(`${accessData.id} enum info获取失败!`);
      return;
    }

    const currentEnum = Object.assign({}, enumKey, enumInfo[pathParams]); // 合并默认enumKey
    const targetService = currentEnum.service;
    const targetPath = currentEnum.path;
    const targetDataKey = currentEnum.data;
    const targetNameKey = currentEnum.name;
    const targetCodeKey = currentEnum.code;

    if (targetService === 'xxxxx') {
      requestData = { // 兼容base64加密传输的请求
        params: new Buffer(JSON.stringify(requestData)).toString('base64'),
      };
    }

    let requestResult = await this.service.pass[targetService].curl(targetPath, {
      method: ctx.method,
      data: requestData,
    });

    requestResult = requestResult[targetDataKey] || requestResult;

    const data = await this.service.base.utlis.eunmService.enum(requestResult, { // 必须有await
      name: targetNameKey,
      code: targetCodeKey,
    }, enumType);

    ctx.formatSuccessResp({ data });
  }


};

