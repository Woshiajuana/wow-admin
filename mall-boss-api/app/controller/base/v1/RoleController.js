'use strict';

const Controller = require('egg').Controller;

module.exports = class RoleController extends Controller {

  static route(app, middlewares, controller) {
    const { get, post } = app.router;

    get('/api/base/v1/role/list',
      middlewares.accessToken(),
      middlewares.logger({ group: '角色', name: '角色列表', level: 0 }),
      controller.list);

    post('/api/base/v1/role/create',
      middlewares.accessToken(),
      middlewares.logger({ group: '角色', name: '创建角色', level: 0 }),
      controller.create);

    post('/api/base/v1/role/modify',
      middlewares.accessToken(),
      middlewares.logger({ group: '角色', name: '修改角色', level: 0 }),
      controller.modify);

    post('/api/base/v1/role/delete',
      middlewares.accessToken(),
      middlewares.logger({ group: '角色', name: '删除角色', level: 1 }),
      controller.delete);
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
   * @apiParam  {String} pageNo 页码
   * @apiParam  {String} pageSize 数量
   * @apiParam  {String} roleNo 角色号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/role/list
   *
   */

  async list() {
    const { ctx, logger, service } = this;
    const { accessData, helper } = ctx;
    const { role } = accessData;
    const { pageNo, pageSize, startTime, endTime, name, level, status, parent } = ctx.query;

    logger.info(`用户:${accessData.id}获取角色列表开始》》》》》》`);

    if (!pageNo || !pageSize) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.query)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const offset = (pageNo - 1) * pageSize;

    const limit = Number.parseInt(pageSize);

    const roleList = await service.base.roleService.findRoleByAppNo({ appNo: accessData.app.app_no, offset, limit, startTime, endTime, name, level: role.level, status, parent });

    roleList.list = helper.toHump(roleList.list, true);

    for (const item of roleList.list) {
      item.isLinealKin = await service.base.roleService.isLinealKinRole(item.roleNo, role);
    }

    const data = helper.toExportList({
      count: roleList.count,
      list: roleList.list,
      title: '角色列表',
    });

    logger.info(`用户: ${accessData.id} 获取 Role信息`);
    ctx.formatSuccessResp({ data });

  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/role/create 创建角色
   *
   * @apiDescription 创建角色
   *
   * @apiGroup Role
   *
   * @apiParam  {String} name 角色名称
   * @apiParam  {String} status 状态
   * @apiParam  {String} permMenu 权限菜单
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/role/create
   *
   */
  async create() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const { user_name } = accessData.operator;
    const { org_no, app_no, role_no, level } = accessData.role;
    const { name, status, desc = '', permMenus } = ctx.request.body;

    if (!name || !status || !permMenus) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.request.body)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const modelData = {
      permMenus,
      org_no,
      app_no,
      parent: role_no,
      name,
      desc,
      level: level + 1,
      status,
      creator_name: user_name,
    };

    logger.info(`用户: ${accessData.id} 开始创建角色`);

    const roleModel = await service.base.roleService.createRole(modelData);
    if (!roleModel) {
      ctx.throwError('创建角色失败');
      return;
    }

    ctx.formatSuccessResp({ data: roleModel });
    logger.info(`用户: ${accessData.id} 新增角色成功`);
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
    const role = accessData.role;
    const { org_no, app_no } = accessData.role;
    const { roleNo, name, status, desc = '', permMenus } = ctx.request.body;

    if (!roleNo || !name || !status || !permMenus) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.request.body)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const findSameNameRole = await service.base.roleService.findRoleByCondition({
      app_no: accessData.app.app_no,
      name,
    });

    if (findSameNameRole && findSameNameRole.dataValues.role_no !== roleNo) {
      ctx.throwError('角色名已存在, 请更换后重试!');
      return;
    }

    const isLinealKinRole = await service.base.roleService.isLinealKinRole(roleNo, role);

    if (!isLinealKinRole) {
      ctx.throwError('无权限编辑此角色');
      return;
    }

    const modelData = {
      role_no: roleNo,
      org_no,
      app_no,
      name,
      desc,
      status,
      permMenus,
    };

    logger.info(`用户: ${accessData.id} 开始修改角色`);

    const roleModel = await service.base.roleService.modifyRole(modelData);
    if (!roleModel) {
      ctx.throwError('修改角色失败');
      return;
    }

    ctx.formatSuccessResp({ data: roleModel });
    logger.info(`用户: ${accessData.id} 修改角色成功`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/base/v1/role/delete 删除操作员
   *
   * @apiDescription 删除操作员
   *
   * @apiGroup Operator
   *
   * @apiParam  {String} [operatorNo] 操作员号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/base/v1/role/delete
   *
   */
  async delete() {
    const { ctx, logger, service } = this;
    const { accessData } = ctx;
    const role = accessData.role;
    const { org_no, app_no } = accessData.role;
    const { roleNo } = ctx.request.body;

    if (!roleNo) {
      logger.info(`请求参数错误》》》》》,request:${JSON.stringify(ctx.request.body)}`);
      ctx.formatFailResp({ errCode: 'F490002' });
      return;
    }

    const isLinealKinRole = await service.base.roleService.isLinealKinRole(roleNo, role);


    if (!isLinealKinRole) {
      ctx.throwError('无权限编辑此角色');
      return;
    }

    // 先查角色下面是否有操作员
    const operatorList = await service.base.operatorService.list({ 
      appNo: accessData.app.app_no,
      roleNo,
      offset: 0,
      limit: 1,
    });

    if (operatorList.count > 0) {
      logger.info(`角色 ${roleNo} 下有操作员，无法删除!`);
      ctx.throwError('该角色下有操作员，无法删除!');
      return;
    }

    const modelData = {
      role_no: roleNo,
      org_no,
      app_no,
    };

    logger.info(`用户: ${accessData.id} 开始删除角色`);

    const roleModel = await service.base.roleService.deleteRole(modelData);
    if (!roleModel) {
      ctx.throwError('删除角色失败');
      return;
    }

    ctx.formatSuccessResp({ data: roleModel });
    logger.info(`用户: ${accessData.id} 删除角色成功`);
  }
};
