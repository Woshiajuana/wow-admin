'use strict';

const Service = require('egg').Service;

module.exports = class OrgConfigService extends Service {

  async findOrgConfigObjByCondition(condition = {}) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOrgConfig } = model;

    if (!condition.org_no) {
      ctx.throwError('org_no 不能为空');
      return;
    }

    const whereCondition = {
      status: 'normal', // 默认值
      ...condition,
    };

    logger.info(`findOrgConfigObjByCondition ${JSON.stringify(whereCondition)} 开始`);
    const orgConfigs = await PpOrgConfig.findAll({
      where: whereCondition,
    });

    if (!orgConfigs) {
      logger.info(`findOrgConfigObjByCondition ${JSON.stringify(whereCondition)} 未找到`);
      return null;
    }

    const orgConfigObj = {};

    if (orgConfigs && orgConfigs[0]) {
      orgConfigs.forEach(item => {
        if (item.category) {
          if (!orgConfigObj[item.category]) {
            orgConfigObj[item.category] = {};
          }
          if (item.key) {
            orgConfigObj[item.category][item.key] = item.value;
          }
        } else {
          if (item.key) {
            orgConfigObj[item.key] = item.value;
          }
        }
      });
    }

    logger.info(`findOrgConfigObjByCondition ${JSON.stringify(whereCondition)} 完成`);

    return orgConfigObj;
  }

  async list(condition = {}) {
    const { app, ctx, logger } = this;
    const { model, accessData, helper } = ctx;
    const { PpOrgConfig } = model;
    const { Op } = app.Sequelize;

    if (!condition.org_no) {
      ctx.throwError('org_no 不能为空');
      return;
    }

    const result = {};
    const { offset, limit, startTime, endTime } = condition;

    // filter undefined
    const filterField = [ 'offset', 'limit', 'startTime', 'endTime' ];
    const whereCondition = helper.filterField(condition, filterField);

    // like search
    if (whereCondition.category) {
      whereCondition.category = {
        $like: whereCondition.category,
      };
    }

    // like search
    if (whereCondition.key) {
      whereCondition.key = {
        $like: whereCondition.key,
      };
    }

    // like search
    if (whereCondition.value) {
      whereCondition.value = {
        $like: whereCondition.value,
      };
    }

    // like search
    if (whereCondition.desc) {
      whereCondition.desc = {
        $like: whereCondition.desc,
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

    logger.info(`OrgConfigService list ${JSON.stringify(whereCondition)} 开始`);
    const { rows, count } = await PpOrgConfig.findAndCountAll(sqlModel);

    if (!count) {
      logger.info(`OrgConfigService list ${JSON.stringify(whereCondition)} 无记录`);
    }

    result.list = rows;
    result.count = count;

    logger.info(`OrgConfigService list ${JSON.stringify(whereCondition)} 完成`);

    return result;
  }

  async query(condition = {}) {
    const { app, ctx, logger } = this;
    const { model, accessData, helper } = ctx;
    const { PpOrgConfig } = model;
    const { Op } = app.Sequelize;

    if (!condition.org_no) {
      ctx.throwError('org_no 不能为空');
      return;
    }

    // filter undefined
    const whereCondition = helper.filterField(condition);

    logger.info(`OrgConfigService query ${JSON.stringify(whereCondition)} 开始`);
    const result = await PpOrgConfig.findOne({
      where: whereCondition,
    });

    if (!result) {
      logger.info(`OrgConfigService query ${JSON.stringify(whereCondition)} 未找到`);
      ctx.throwError('无记录');
      return;
    }

    logger.info(`OrgConfigService query ${JSON.stringify(whereCondition)} 完成`);
    return result;
  }

  async create(condition = {}) {
    const { app, ctx, logger } = this;
    const { model, accessData, helper } = ctx;
    const { PpOrgConfig } = model;
    const { Op } = app.Sequelize;

    if (!condition.org_no) {
      ctx.throwError('org_no 不能为空');
      return;
    }

    // filter undefined
    const createCondition = helper.filterField(condition);
    const { category, key, value } = createCondition;

    logger.info(`OrgConfigService create ${JSON.stringify(createCondition)} 开始`);
    const [ result, status ] = await PpOrgConfig.findOrCreate({
      where: { category, key, value },
      defaults: {
        org_no: '',
        category: '',
        key: '',
        value: '',
        desc: '',
        status: '',
        ...createCondition,
      },
    });

    if (!status) {
      logger.info(`category:${category}, key:${key}, value:${value} 三项唯一, 请修改后重试!`);
      ctx.throwError(`category:${category}, key:${key}, value:${value} 三项唯一, 请修改后重试!`);
      return;
    }

    logger.info(`OrgConfigService create ${JSON.stringify(createCondition)} 完成`);
    return result;
  }

  async update(condition = {}) {
    const { app, ctx, logger } = this;
    const { model, accessData, helper } = ctx;
    const { PpOrgConfig } = model;
    const { Op } = app.Sequelize;

    if (!condition.id) {
      ctx.throwError('id 不能为空');
      return;
    }

    // filter undefined
    const updateCondition = helper.filterField(condition);

    logger.info(`OrgConfigService update ${JSON.stringify(updateCondition)} 开始`);
    const [ result ] = await PpOrgConfig.update(updateCondition, {
      where: {
        id: updateCondition.id,
      },
    });

    if (!result) {
      logger.info(`OrgConfigService update ${JSON.stringify(updateCondition)} 开始`);
      ctx.throwError('更新失败');
      return;
    }

    logger.info(`OrgConfigService update ${JSON.stringify(updateCondition)} 完成`);
    return result;
  }

  async delete(condition = {}) {
    const { app, ctx, logger } = this;
    const { model, accessData, helper } = ctx;
    const { PpOrgConfig } = model;
    const { Op } = app.Sequelize;

    if (!condition.id) {
      ctx.throwError('id 不能为空');
      return;
    }

    logger.info(`OrgConfigService delete ${JSON.stringify(condition)} 开始`);

    // // soft delete
    // const result = await PpOrgConfig.update({
    //   isDelete: 1,
    // }, {
    //   where: {
    //     id: condition.id,
    //   },
    // });

    // physics delete
    const result = await PpOrgConfig.destroy({
      where: {
        id: condition.id,
      },
    });

    if (!result) {
      logger.info(`OrgConfigService delete ${JSON.stringify(condition)} 开始`);
      ctx.throwError('删除失败');
      return;
    }

    logger.info(`OrgConfigService delete ${JSON.stringify(condition)} 完成`);
    return result;
  }
};

