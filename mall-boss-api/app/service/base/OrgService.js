'use strict';

const Service = require('egg').Service;

class OrgService extends Service {

  async findOrgByOrgNo({ orgNo }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOrg } = model;

    logger.info(`findOrgByOrgNo ${orgNo} 开始`);

    const org = await PpOrg.find({
      where: {
        org_no: orgNo,
        status: 'normal',
      },
    });

    if (!org) {
      logger.info(`findOrgByOrgNo ${orgNo} 未找到`);
      return null;
    }

    logger.info(`findOrgByOrgNo ${orgNo} org_no:${org.org_no} 完成`);

    return org;
  }

  async createOrg(modelDate = {}) {
    const { ctx, logger } = this;
    const { model, ip, helper } = ctx;
    const { PpOrg } = model;

    const org_no = 'OG' + helper.uuidCode(18);// 20位
    const created_at = ctx.helper.sqlNow();

    let createdStatus = false;

    await PpOrg.findOrCreate(
      {
        where: { org_no },
        defaults: {
          org_no,
          belong_to_org: '',
          own_to_org: '',
          name: '',
          nick_name: '',
          desc: '',
          mobile: '',
          email: '',
          website: '',
          type: 'platform',
          level: '',
          max_level: '',
          creator_create_type: '',
          creator_name: '',
          status: 'normal',
          ...modelDate,
        },
      }).spread((user, created) => {
      createdStatus = created;
    });

    if (!createdStatus) {
      logger.info('创建org失败');
      ctx.throwError('创建org失败');
    }

    return { org_no };
  }
}

module.exports = OrgService;

