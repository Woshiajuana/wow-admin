'use strict';

const Service = require('egg').Service;

module.exports = class AppService extends Service {
  async findOrgAppByCondition(condition) { // 通过条件查找app
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOrgAppDomain, PpOrgApp } = model;

    logger.info(`orgApp>>>>>>>>>>>:${PpOrgApp}`);

    const domain = condition.domain || '';
    delete condition.domain;

    const whereCondition = {
      status: 'normal', // 默认值
      ...condition,
    };

    if (domain) {
      logger.info(`findOrgAppByCondition domain:${domain} 开始`);
      const orgAppDomain = await PpOrgAppDomain.findOne({
        where: {
          domain,
          status: 'normal',
        },
      });

      if (!orgAppDomain) {
        logger.info(`findOrgAppByCondition domain:${domain} 未找到 orgAppDomain`);
        return null;
      }
      whereCondition.app_no = orgAppDomain.app_no;
    }

    logger.info(`findOrgAppByCondition ${JSON.stringify(whereCondition)} 开始`);
    const orgApp = await PpOrgApp.findOne({
      where: whereCondition,
    });

    if (!orgApp) {
      logger.info(`findOrgAppByCondition ${JSON.stringify(whereCondition)} 未找到 orgApp`);
      return null;
    }

    logger.info(`findOrgAppByCondition ${JSON.stringify(whereCondition)} app_no:${orgApp.app_no} 完成`);

    return orgApp;
  }

  async list(condition = {}) {
    const { app, ctx, logger } = this;
    const { model, accessData, helper } = ctx;
    const { PpOrgApp } = model;
    const { Op } = app.Sequelize;

    if (!condition.belong_to_org) {
      ctx.throwError('belong_to_org 不能为空');
      return;
    }

    const result = {};
    const { offset, limit, startTime, endTime } = condition;

    // filter undefined
    const filterField = [ 'offset', 'limit', 'startTime', 'endTime' ];
    const whereCondition = helper.filterField(condition, filterField);

    // like search
    if (whereCondition.name) {
      whereCondition.name = {
        $like: whereCondition.name,
      };
    }
    // like search
    if (whereCondition.logo) {
      whereCondition.logo = {
        $like: whereCondition.logo,
      };
    }
    // like search
    if (whereCondition.desc) {
      whereCondition.desc = {
        $like: whereCondition.desc,
      };
    }
    // like search
    if (whereCondition.icp) {
      whereCondition.icp = {
        $like: whereCondition.icp,
      };
    }
    // like search
    if (whereCondition.app_info) {
      whereCondition.app_info = {
        $like: whereCondition.app_info,
      };
    }

    // 时间区间
    if (startTime && endTime) {
      whereCondition.created_at = {
        $between: [ startTime, endTime ],
      };
    }

    const sqlModel = {
      where: whereCondition,
      order: [[ 'updated_at', 'desc' ]],
    };

    // 分页
    if (offset && limit) {
      Object.assign(sqlModel, {
        offset,
        limit,
      });
    }

    logger.info(`AppService list ${JSON.stringify(whereCondition)} 开始`);
    const { rows, count } = await PpOrgApp.findAndCountAll(sqlModel);

    if (!count) {
      logger.info(`AppService list ${JSON.stringify(whereCondition)} 无记录`);
    }

    result.list = rows;
    result.count = count;

    logger.info(`AppService list ${JSON.stringify(whereCondition)} 完成`);

    return result;
  }
};
