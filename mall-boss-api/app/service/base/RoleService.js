'use strict';

const Service = require('egg').Service;

class RoleService extends Service {

  async findRoleByAppNo({ appNo, offset = 0, limit = 20, startTime, endTime, name, level, status, parent, roleNo }) {
    const { app, ctx, logger } = this;
    const { model } = ctx;
    const { PpRole } = model;
    const { Op } = app.Sequelize;

    if (!appNo) {
      ctx.throwError('appNo 不能为空');
      return;
    }

    logger.info(`findRoleByAppNo ${appNo} 开始`);

    const whereCondition = {
      app_no: appNo,
    };

    if (startTime && endTime) {
      whereCondition.created_at = {
        [Op.between]: [ startTime, endTime ],
      };
    }

    if (name) {
      whereCondition.name = name;
    }

    if (level) {
      whereCondition.level = {
        [Op.gte]: level,
      };
    }

    if (status) {
      whereCondition.status = status;
    }

    if (parent) {
      whereCondition.parent = parent;
    }

    if (roleNo) {
      whereCondition.role_no = roleNo;
    }

    const roleList = {};
    await PpRole.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [[ 'created_at', 'desc' ]],
    }).then(result => {
      roleList.count = result.count;
      roleList.list = result.rows;
    });

    // 挂上每个角色的权限
    for (let i = 0; i < roleList.list.length; i++) {
      roleList.list[i].dataValues.perm = await this.findPermByRoleNo(roleList.list[i].dataValues.role_no);
    }

    logger.info(`findRoleByAppNo ${appNo} 结束`);

    return roleList;
  }

  async findRoleByRoleNo(roleNo) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpRole } = model;

    if (!roleNo) {
      ctx.throwError('roleNo 不能为空');
      return;
    }

    logger.info(`findRoleByRoleNo ${roleNo} 开始`);


    const whereCondition = {
      role_no: roleNo,
    };

    const roles = await PpRole.findOne({
      where: whereCondition,
    });

    logger.info(`findRoleByRoleNo ${roleNo} 结束`);

    return roles;
  }

  async findRoleByCondition(condition) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpRole } = model;

    const whereCondition = {
      status: 'normal', // 默认值
      ...condition,
    };

    logger.info(`findRoleByCondition ${JSON.stringify(whereCondition)} 开始`);

    const roles = await PpRole.findOne({
      where: whereCondition,
    });

    logger.info(`findRoleByCondition ${JSON.stringify(whereCondition)} 结束`);

    return roles;
  }

  async findPermByRoleNo(roleNo) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpRolePermission } = model;

    logger.info(`findPermByRole ${roleNo} 开始`);

    const perm = {};

    if (roleNo) {
      const rolePermissions = await PpRolePermission.findAll({
        where: {
          role_no: roleNo,
          status: 'normal',
        },
      });

      rolePermissions.forEach(permission => {
        perm[permission.resource_code] = true;
      });
    }

    logger.info(`findPermByRole ${roleNo} 结束`);

    return perm;
  }


  async isLinealKinRole(roleNo, targetRole) {
    const { ctx, logger } = this;

    if (!roleNo) {
      ctx.throwError('roleNo 不能为空');
      return;
    }

    if (!targetRole) {
      ctx.throwError('targetRole 不能为空');
      return;
    }

    logger.info(`isLinealKinRole ${roleNo} in ${targetRole.role_no} 开始`);

    const result = await this.findRoleByRoleNo(roleNo);
    const findRole = result.dataValues;
    if (findRole.parent !== targetRole.role_no) {
      if (findRole.parent === targetRole.parent || findRole.parent === '') {
        logger.info(`isLinealKinRole ${roleNo} in ${targetRole.role_no} 结束 is false`);
        return false;
      }
      return await this.isLinealKinRole(findRole.parent, targetRole);
    }

    logger.info(`isLinealKinRole ${roleNo} in ${targetRole.role_no} 结束 is true`);

    return true;
  }

  async createPerm({ resource_code, role_no, app_no, org_no, status = 'normal' }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpRolePermission } = model;

    let createdStatus = false;

    await PpRolePermission.findOrCreate(
      {
        where: { resource_code, role_no },
        defaults: {
          resource_code,
          role_no,
          app_no,
          org_no,
          status,
        },
      }).spread((user, created) => {
      createdStatus = created;
    });

    if (!createdStatus) {
      logger.info(`权限资源 ${resource_code} 已存在!`);
      ctx.throwError({ msg: `权限资源 ${resource_code} 创建失败!` });
    }

    return createdStatus;
  }

  // permMenu<string>
  async createRole({ permMenus = [], org_no, app_no, parent, name, desc, level, status, creator_name }) {
    const { app, ctx, logger } = this;
    const { model, ip, helper } = ctx;
    const { PpRole, PpRolePermission } = model;

    const role_no = 'RO' + helper.uuidCode(18);
    const created_at = ctx.helper.sqlNow();
    let transaction;

    try {
      transaction = await model.transaction();

      // 创建角色
      const [ role, isNewCreated ] = await PpRole.findOrCreate({
        where: { name, app_no },
        defaults: {
          role_no,
          org_no,
          app_no,
          parent,
          name,
          desc,
          level,
          status,
          creator_name,
          created_at,
          updated_at: created_at,
        },
        transaction,
      });

      if (!isNewCreated) {
        logger.info(`角色名已存在 ${name} 创建失败!`);
        ctx.throwError(`角色名已存在 ${name} 创建失败!`);
        return;
      }

      // 插入角色权限模型列表
      const permModelList = [];
      for (const resource_code of permMenus) {
        permModelList.push({
          resource_code,
          role_no,
          app_no,
          org_no,
          status: 'normal',
        });
      }

      // 批量插入角色权限
      await PpRolePermission.bulkCreate(permModelList, transaction);

      // 事务提交
      await transaction.commit();

      return role;

    } catch (error) {
      // 若失败，事务回滚
      await transaction.rollback();
      throw error;
    };
  }

  async modifyRole({role_no, org_no, app_no, name, desc, status, permMenus }) {
    const { app, ctx, logger } = this;
    const { model, ip } = ctx;
    const { PpRole, PpRolePermission } = model;

    let transaction;

    try {
      transaction = await model.transaction();

      // 修改角色
      const [ affectedCount, affectedRows ] = await PpRole.update(
        {
          name,
          desc,
          status,
        },
        { where: { role_no }, transaction }
      );

      // 先删除全部角色权限
      await PpRolePermission.destroy({ where: { role_no, app_no, org_no } });

      // 插入角色权限模型列表
      const permModelList = [];
      for (const resource_code of permMenus) {
        permModelList.push({
          resource_code,
          role_no,
          app_no,
          org_no,
          status: 'normal',
        });
      }

      // 再批量插入角色权限
      await PpRolePermission.bulkCreate(permModelList, transaction);

      // 事务提交
      await transaction.commit();

      return role_no;

    } catch (error) {
      // 若失败，事务回滚
      await transaction.rollback();
      throw error;
    };
  }

  async deleteRole({role_no, org_no, app_no }) {
    const { app, ctx, logger } = this;
    const { model, ip } = ctx;
    const { PpRole, PpRolePermission } = model;

    let transaction;

    try {
      transaction = await model.transaction();

      // 删除角色
      await PpRole.destroy({ where: { role_no, app_no, org_no }, transaction });

      // 先删除全部角色权限
      await PpRolePermission.destroy({ where: { role_no, app_no, org_no }, transaction });

      // 事务提交
      await transaction.commit();

      logger.info(`role_no: ${role_no} 删除角色成功`);
      return role_no;

    } catch (error) {
      // 若失败，事务回滚
      await transaction.rollback();
      throw error;
    };
  }

}

module.exports = RoleService;
