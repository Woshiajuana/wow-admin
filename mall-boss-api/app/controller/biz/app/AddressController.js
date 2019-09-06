'use strict';

const Controller = require('egg').Controller;

module.exports = class AddressController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/app/address/list',
      middlewares.accessToken(),
      controller.list);

    post('/api/v1/app/address/query',
      middlewares.accessToken(),
      controller.query);

    post('/api/v1/app/address/add',
      middlewares.accessToken(),
      controller.add);

    post('/api/v1/app/address/update',
      middlewares.accessToken(),
      controller.update);

    post('/api/v1/app/address/delete',
      middlewares.accessToken(),
      controller.delete);

    post('/api/v1/app/address/set-default',
      middlewares.accessToken(),
      controller.setDefault);

  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/address/list 收货地址列表
   *
   * @apiDescription 收货地址列表
   *
   * @apiGroup App-Address
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/address/list
   *
   */

  async list() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const {} = requestData;

    logger.info(`userId: ${accessData.id} 查询 收货地址列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryAddressList', {
      method: 'post',
      data: {
        userNo: accessData.id,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 收货地址列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/address/query 收货地址查询
   *
   * @apiDescription 收货地址查询
   *
   * @apiGroup App-Address
   *
   * @apiParam {String} addressId 收货地址id
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/address/query
   *
   */

  async query() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { addressId } = requestData;

    if (!addressId) {
      logger.info(`addressId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('addressId不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 查询 收货地址列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryAddressById', {
      method: 'post',
      data: {
        addressId,
        userNo: accessData.id,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 收货地址列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/address/add 收货地址增加
   *
   * @apiDescription 收货地址增加
   *
   * @apiGroup App-Address
   *
   * @apiParam  {String} contactName 收货人姓名
   * @apiParam  {String} contactPhone 收货人电话
   * @apiParam  {String} province 省
   * @apiParam  {String} city 市
   * @apiParam  {String} county 县
   * @apiParam  {String} contactAddress 收货详细地址
   * @apiParam  {String{1、家 2、公司 3、学校}} [addressLabel] 地址标签
   * @apiParam  {String} [isDefault] 是否默认地址
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/address/add
   *
   */

  async add() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { contactName, contactPhone, province, city, county, contactAddress, addressLabel, isDefault } = requestData;

    if (!contactName || !contactPhone || !province || !city || !county || !contactAddress) {
      logger.info(`!contactName || !contactPhone || !province || !city || !county || !contactAddress 等参数不能为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('!contactName || !contactPhone || !province || !city || !county || !contactAddress 等参数不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 收货地址增加 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/addAddress', {
      method: 'post',
      data: {
        userNo: accessData.id,
        contactName,
        contactPhone,
        province,
        city,
        county,
        contactAddress,
        addressLabel,
        isDefault,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 收货地址增加 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/address/update 收货地址修改
   *
   * @apiDescription 收货地址修改
   *
   * @apiGroup App-Address
   *
   * @apiParam  {String} addressId addressId
   *
   * @apiParam  {String} contactName 收货人姓名
   * @apiParam  {String} contactPhone 收货人电话
   * @apiParam  {String} province 省
   * @apiParam  {String} city 市
   * @apiParam  {String} county 县
   * @apiParam  {String} contactAddress 收货详细地址
   * @apiParam  {String{1、家 2、公司 3、学校}} [addressLabel] 地址标签
   * @apiParam  {String} [isDefault] 是否默认地址
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/address/update
   *
   */

  async update() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { addressId, contactName, contactPhone, province, city, county, contactAddress, addressLabel, isDefault } = requestData;

    if (!addressId) {
      logger.info(`addressId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('addressId不能为空', 'F400');
      return;
    }
    if (!contactName || !contactPhone || !province || !city || !county || !contactAddress) {
      logger.info(`!contactName || !contactPhone || !province || !city || !county || !contactAddress 等参数不能为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('!contactName || !contactPhone || !province || !city || !county || !contactAddress 等参数不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 收货地址修改 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/updateAddress', {
      method: 'post',
      data: {
        addressId,
        userNo: accessData.id,
        contactName,
        contactPhone,
        province,
        city,
        county,
        contactAddress,
        addressLabel,
        isDefault,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 收货地址修改 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/address/delete 收货地址删除
   *
   * @apiDescription 收货地址删除
   *
   * @apiGroup App-Address
   *
   * @apiParam  {String} addressId addressId
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/address/delete
   *
   */

  async delete() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { addressId } = requestData;

    if (!addressId) {
      logger.info(`addressId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('addressId不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 收货地址删除 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/updateAddress', {
      method: 'post',
      data: {
        addressId,
        status: 'disabled',
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 收货地址删除 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/app/address/set-default 设置默认收货地址
   *
   * @apiDescription 设置默认收货地址
   *
   * @apiGroup App-Address
   *
   * @apiParam  {String} addressId addressId
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/app/address/set-default
   *
   */

  async setDefault() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { addressId } = requestData;

    if (!addressId) {
      logger.info(`addressId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('addressId不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 设置默认收货地址 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/updateAddress', {
      method: 'post',
      data: {
        addressId,
        userNo: accessData.id,
        isDefault: 'normal',
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 设置默认收货地址 成功！ ip: ${ctx.ip}`);
  }

};

