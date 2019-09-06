'use strict';

const Controller = require('egg').Controller;

module.exports = class RoleController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    get('/api/base/v1/operator/list',
      middlewares.accessToken(),
      middlewares.logger({ group: '操作员', name: '操作员列表', level: 0 }),
      controller.list);

    post('/api/base/v1/operator/create',
      middlewares.accessToken(),
      middlewares.logger({ group: '操作员', name: '创建操作员', level: 1 }),
      controller.create);

    post('/api/base/v1/operator/modify',
      middlewares.accessToken(),
      middlewares.logger({ group: '操作员', name: '修改操作员', level: 1 }),
      controller.modify);

    post('/api/base/v1/operator/delete',
      middlewares.accessToken(),
      middlewares.logger({ group: '操作员', name: '删除操作员', level: 1 }),
      controller.delete);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} /api/base/v1/operator/list 操作员列表
   *
   * @apiDescription 操作员列表
   *
   * @apiGroup Operator
   *
   * @apiParam  {String} [roleNo] 角色
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/list
   *
   */
  async list() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { pageNo, pageSize, roleNo, userName, nickName, mobile, email, status } = ctx.query;
    const { role } = accessData;

    logger.info('开始获取操作员列表》》》》》');

    if (!pageNo || !pageSize) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.query)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const offset = (pageNo - 1) * pageSize;

    const limit = Number.parseInt(pageSize);

    const operatorList = await service.base.operatorService.list({ 
      appNo: accessData.app.app_no,
      offset,
      limit,
      level: role.level,
      roleNo,
      userName,
      nickName,
      mobile,
      email,
      status,
    });

    operatorList.list = helper.toHump(operatorList.list, true);
    for (const item of operatorList.list) {
      item.isLinealKin = await service.base.roleService.isLinealKinRole(item.roleNo, role);
    }

    const data = helper.toExportList({
      count: operatorList.count,
      list: operatorList.list,
      title: '操作员列表',
    });

    logger.info(`用户: ${accessData.id} 获取 用户Operator信息`);
    ctx.formatSuccessResp({ data });

  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/operator/create 新增操作员
   *
   * @apiDescription 新增操作员
   *
   * @apiGroup Operator
   *
   * @apiParam  {String} email 邮箱
   * @apiParam  {String} mobile 手机号
   * @apiParam  {String} belongToOrg 直属组织
   * @apiParam  {String} ownToOrg 隶属组织
   * @apiParam  {String} userName 名称
   * @apiParam  {String} status 状态
   * @apiParam  {String} roleNo 角色号
   * @apiParam  {String} nickName 角色号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/create
   *
   */
  async create() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const { user_name } = accessData.operator;
    const { roleNo, userName, password, nickName, mobile, email, status = 'disabled' } = ctx.request.body;
    const { own_to_org, app_no } = accessData.operator;

    if (!roleNo || !userName || !password || !nickName || !mobile || !email) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.request.body)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const modelData = {
      app_no,
      belong_to_org: own_to_org,
      role_no: roleNo,
      user_name: userName,
      password,
      nick_name: nickName,
      mobile,
      email,
      status,
      creator_name: user_name,
    };

    const data = await service.base.operatorService.createOperator(modelData);

    ctx.formatSuccessResp({ data });


    logger.info(`用户: ${accessData.id} 新增操作员成功`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/operator/modify 编辑操作员
   *
   * @apiDescription 编辑操作员
   *
   * @apiGroup Operator
   *
   * @apiParam  {String} [email] 邮箱
   * @apiParam  {String} [mobile] 手机号
   * @apiParam  {String} [belongToOrg] 直属组织
   * @apiParam  {String} [ownToOrg] 隶属组织
   * @apiParam  {String} [userName] 名称
   * @apiParam  {String} [status] 状态
   * @apiParam  {String} [roleNo] 角色号
   * @apiParam  {String} [nickName] 角色号
   * @apiParam  {String} operatorNo 操作员号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/modify
   *
   */
  async modify() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const role = accessData.role;
    const { operatorNo, roleNo, userName, password, nickName, mobile, email, status } = ctx.request.body;

    if (!operatorNo || !roleNo || !userName || !password || !nickName || !mobile || !email) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.request.body)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const currModifyOperator = await service.base.operatorService.findByOperatorNo(operatorNo, false, false);
    const isLinealKinRole = await service.base.roleService.isLinealKinRole(currModifyOperator.dataValues.role_no, role);

    if (!isLinealKinRole) {
      ctx.throwError('无权限编辑此操作员');
      return;
    }

    const modelData = {
      operator_no: operatorNo,
      role_no: roleNo,
      user_name: userName,
      password,
      nick_name: nickName,
      mobile,
      email,
      status,
    };

    const data = await service.base.operatorService.modifyOperator(modelData);

    ctx.formatSuccessResp({ data });

    if (status === 'disabled') {
      ctx.destroyAccessDatasByUserId(operatorNo);
    }

    logger.info(`用户: ${accessData.id} 修改操作员成功`);
  }


  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/operator/delete 删除操作员
   *
   * @apiDescription 删除操作员
   *
   * @apiGroup Operator
   *
   * @apiParam  {String} [operatorNo] 操作员号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/operator/delete
   *
   */
  async delete() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const role = accessData.role;
    const { operatorNo } = ctx.request.body;

    if (!operatorNo) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.request.body)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const currModifyOperator = await service.base.operatorService.findByOperatorNo(operatorNo, false, false);
    const isLinealKinRole = await service.base.roleService.isLinealKinRole(currModifyOperator.dataValues.role_no, role);

    if (!isLinealKinRole) {
      ctx.throwError('无权限编辑此操作员');
      return;
    }

    const modelData = {
      operator_no: operatorNo,
    };

    const operatorModel = await service.base.operatorService.deleteOperator(modelData);

    ctx.formatSuccessResp({ data: operatorModel });

    logger.info(`用户: ${accessData.id} 删除操作员成功`);
  }

  // -- end
};

