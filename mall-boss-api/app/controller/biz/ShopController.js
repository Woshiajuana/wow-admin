'use strict';

const Controller = require('egg').Controller;

module.exports = class FileController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get, all } = app.router;

    post('/api/v1/shop/list',
      middlewares.accessToken(),
      controller.list);

    post('/api/v1/shop/query',
      middlewares.accessToken(),
      controller.query);

    post('/api/v1/shop/create',
      middlewares.accessToken(),
      controller.create);

    post('/api/v1/shop/update',
      middlewares.accessToken(),
      controller.update);

    post('/api/v1/shop/toggle-status',
      middlewares.accessToken(),
      controller.toggleStatus);

    post('/api/v1/shop/check-shop',
      middlewares.accessToken(),
      controller.checkShop);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shop/list 店铺列表
   *
   * @apiDescription 店铺列表
   *
   * @apiGroup Shop
   *
   * @apiParam  {String} [export] 是否导出模式
   *
   * @apiParam  {String} [platformNo] 平台编号
   * @apiParam  {String} [companyName] 公司名
   * @apiParam  {String} [shopNo] 店铺编号
   * @apiParam  {String} [shopName] 店铺名称
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shop/list
   *
   */

  async list() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {}, helper } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { platformNo, companyName, shopNo, shopName, pageNum = '1', pageSize = '20', startTime, endTime } = requestData;

    logger.info(`userId: ${accessData.id} 查询 店铺列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryShopList', {
      method: 'post',
      data: {
        platformNo,
        companyName,
        shopNo,
        shopName,
        pageNum,
        pageSize,
        startTime,
        endTime,
      },
    });

    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 店铺列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shop/query 店铺查询
   *
   * @apiDescription 店铺查询
   *
   * @apiGroup Shop
   *
   * @apiParam  {String} [shopNo] 店铺编号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shop/query
   *
   */

  async query() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { shopNo } = requestData;

    logger.info(`userId: ${accessData.id} 查询 店铺查询 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryShopByShopNo', {
      method: 'post',
      data: {
        shopNo,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 店铺查询 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shop/create 店铺创建
   *
   * @apiDescription 店铺创建
   *
   * @apiGroup Shop
   *
   * @apiParam  {String} [platformNo] 平台号
   * @apiParam  {String} [platformName] 平台名称
   *
   * @apiParam  {String} [companyName] 公司名
   * @apiParam  {String} [shopName] 店铺名称
   *
   * @apiParam  {String} [contactsName] 联系人姓名
   * @apiParam  {String} [contactsPhone] 联系人手机
   * @apiParam  {String} [customerPhone] 客服电话
   *
   * @apiParam  {String} [alipayName] 支付宝名称
   * @apiParam  {String} [alipayId] 支付宝账号
   * @apiParam  {String} [alipayPublicKey] 支付宝RSA公钥
   * @apiParam  {String} [alipayPrivateKey] 支付宝RSA私钥
   *
   * @apiParam  {String} [wechatName] 微信名称
   * @apiParam  {String} [wechatId] 微信账号
   * @apiParam  {String} [wechatPublicKey] 微信RSA公钥
   * @apiParam  {String} [wechatPrivateKey] 微信RSA私钥
   *
   * @apiParam  {String{RSA、RSA2、MD5}} [alipaySignType] 支付宝签名方式
   * @apiParam  {String} [desc] 描述
   * @apiParam  {String} [status] 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shop/create
   *
   */

  async create() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const {
      platformNo, platformName, companyName, shopName,
      contactsName, contactsPhone, customerPhone,
      alipayName, alipayId, alipayPublicKey, alipayPrivateKey,
      wechatName, wechatId, wechatPublicKey, wechatPrivateKey,
      alipaySignType, desc, status,
    } = requestData;

    const params = {
      platformNo,
      platformName,
      companyName,
      shopName,
      contactsName,
      contactsPhone,
      customerPhone,
      alipayName,
      alipayId,
      alipayPublicKey,
      alipayPrivateKey,
      wechatName, wechatId, wechatPublicKey, wechatPrivateKey,
      alipaySignType, desc, status,
    };

    const verifyRules = {
      platformNo: true,
      platformName: true,
      companyName: true,
      shopName: true,
      contactsName: true,
      contactsPhone: true,
      customerPhone: true,
      alipayName: true,
      alipayId: true,
      alipayPublicKey: true,
      alipayPrivateKey: true,
    };
    ctx.validate(verifyRules, requestData);

    logger.info(`userId: ${accessData.id} 查询 店铺创建 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/addShop', {
      method: 'post',
      data: params,
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 店铺创建 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shop/update 店铺更新
   *
   * @apiDescription 店铺更新
   *
   * @apiGroup Shop
   *
   * @apiParam  {String} shopNo 店铺编号
   *
   * @apiParam  {String} [platformNo] 平台号
   * @apiParam  {String} [platformName] 平台名称
   *
   * @apiParam  {String} [companyName] 公司名
   * @apiParam  {String} [shopName] 店铺名称
   *
   * @apiParam  {String} [contactsName] 联系人姓名
   * @apiParam  {String} [contactsPhone] 联系人手机
   * @apiParam  {String} [customerPhone] 客服电话
   *
   * @apiParam  {String} [alipayName] 支付宝名称
   * @apiParam  {String} [alipayId] 支付宝账号
   * @apiParam  {String} [alipayPublicKey] 支付宝RSA公钥
   * @apiParam  {String} [alipayPrivateKey] 支付宝RSA私钥
   *
   * @apiParam  {String} [wechatName] 微信名称
   * @apiParam  {String} [wechatId] 微信账号
   * @apiParam  {String} [wechatPublicKey] 微信RSA公钥
   * @apiParam  {String} [wechatPrivateKey] 微信RSA私钥
   *
   * @apiParam  {String{RSA、RSA2、MD5}} [alipaySignType] 支付宝签名方式
   * @apiParam  {String} [desc] 描述
   * @apiParam  {String} [status] 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shop/update
   *
   */

  async update() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const {
      shopNo,
      platformNo, platformName, companyName, shopName,
      contactsName, contactsPhone, customerPhone,
      alipayName, alipayId, alipayPublicKey, alipayPrivateKey,
      wechatName, wechatId, wechatPublicKey, wechatPrivateKey,
      alipaySignType, desc, status,
    } = requestData;

    const params = {
      shopNo,

      platformNo,
      platformName,
      companyName,
      shopName,
      contactsName,
      contactsPhone,
      customerPhone,
      alipayName,
      alipayId,
      alipayPublicKey,
      alipayPrivateKey,
      wechatName, wechatId, wechatPublicKey, wechatPrivateKey,
      alipaySignType, desc, status,
    };

    const verifyRules = {
      platformNo: true,
      platformName: true,
      companyName: true,
      shopName: true,
      contactsName: true,
      contactsPhone: true,
      customerPhone: true,
      alipayName: true,
      alipayId: true,
      alipayPublicKey: true,
      alipayPrivateKey: true,
    };
    ctx.validate(verifyRules, requestData);

    logger.info(`userId: ${accessData.id} 查询 店铺更新 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/updateShop', {
      method: 'post',
      data: params,
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 店铺更新 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shop/toggle-status 店铺状态切换
   *
   * @apiDescription 店铺状态切换
   *
   * @apiGroup Shop
   *
   * @apiParam  {String} shopNo 店铺编号
   * @apiParam  {String{normal-开启,disabled-关闭}} status 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shop/toggle-status
   *
   */

  async toggleStatus() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { shopNo, status } = requestData;

    if (!shopNo) {
      logger.info(`shopNo为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('shopNo不能为空', 'F400');
      return;
    }
    if (!status) {
      logger.info(`status为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('status不能为空', 'F400');
      return;
    }
    logger.info(`userId: ${accessData.id} 查询 店铺状态切换 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/onOffShop', {
      method: 'post',
      data: {
        shopNo,
        status,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 店铺状态切换 成功！ ip: ${ctx.ip}`);
  }
  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/shop/check-shop 检查店铺
   *
   * @apiDescription 检查店铺
   *
   * @apiGroup Shop
   *
   * @apiParam  {String} shopName 店铺名称
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/shop/check-shop
   *
   */

  async checkShop() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { shopName } = requestData;

    if (!shopName) {
      logger.info(`shopName为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('shopName不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 查询 检查店铺 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/checkShop', {
      method: 'post',
      data: {
        shopName,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 检查店铺 成功！ ip: ${ctx.ip}`);
  }
};

