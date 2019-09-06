'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
const ms = require('ms');
const moment = require('moment');

class OperatorService extends Service {

  async findMenuAndPerm(roleNo) {
    const { ctx, logger, app } = this;
    const { model } = ctx;
    const { PpMenuResource, PpRolePermission } = model;

    logger.info(`findMenuAndPerm ${roleNo} 开始`);

    const permissionHash = {};

    if (roleNo) {

      const rolePermissions = await PpRolePermission.findAll({
        where: {
          role_no: roleNo,
          status: 'normal',
        },
      });

      rolePermissions.forEach(permission => {
        permissionHash[permission.resource_code] = true;
      });
    }

    const rootMenuResource = await PpMenuResource.findOne({
      where: {
        parent: '',
        resource_code: 'root',
        status: 'normal',
      },
    });

    if (!rootMenuResource) {
      throw new Error('rootMenuResource 菜单资源为空，请检查数据库');
    }

    const menu = rootMenuResource.toJSON();
    await this.findSubMenuTree(menu, permissionHash);

    logger.info(`findMenuAndPerm ${roleNo} 结束`);

    return { menu: menu.child, perm: permissionHash };
  }

  async findSubMenuTree(parentMenu, permissionHash) {
    const { ctx } = this;
    const { model } = ctx;
    const { PpMenuResource } = model;
    // const { Op } = app.Sequelize;

    if (!parentMenu) {
      return;
    }

    const subMenuResources = await PpMenuResource.findAll({
      where: {
        parent: parentMenu.resource_code,
        status: 'normal',
      },
      order: [[ 'priority', 'asc' ]], // 优先级大的在后面
    });

    const child = subMenuResources && subMenuResources.length ? [] : null;

    for (const subMenuResource of subMenuResources) {
      if (permissionHash[subMenuResource.resource_code]) {
        const subMenuResourceJson = subMenuResource.toJSON();
        child.push(subMenuResourceJson);
        await this.findSubMenuTree(subMenuResourceJson, permissionHash);
      }
    }

    if (child && child.length) {
      parentMenu.child = child;
    }
  }

  async modify(menuModel) {
    const { ctx } = this;
    const { model } = ctx;
    const { PpMenuResource } = model;
    // const { Op } = app.Sequelize;

    if (!menuModel) {
      return;
    }
    await PpMenuResource.update(
      {
        action_params: menuModel.actionParams,
      },
      { where: { id: menuModel.id } }
    );
  }
}

module.exports = OperatorService;
