'use strict';
const moment = require('moment');
const randomstring = require('randomstring');

const Service = require('egg').Service;

class OperatorService extends Service {

  async createOperator(modelDate = {}) {
    const { ctx, logger } = this;
    const { model, ip, helper } = ctx;
    const { PpOperator } = model;

    const operator_no = 'OP' + helper.uuidCode(18);
    const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    let createdStatus = false;

    const { user_name, app_no } = modelDate;

    await PpOperator.findOrCreate(
      {
        where: { user_name, app_no },
        defaults: {
          operator_no,
          belong_to_org: '',
          own_to_org: '',
          role_no: '',
          app_no: '',
          user_name: '',
          mobile: '',
          email: '',
          nick_name: '',
          otp_key: '',
          password: '',
          register_ip: ip,
          last_login_ip: ip,
          login_max_err_times: 5,
          login_err_times: 0,
          lock_status: 'normal',
          creator_name: '',
          created_at,
          updated_at: created_at,
          status: 'normal',
          ...modelDate,
        },
      }).spread((user, created) => {
      createdStatus = created;
    });

    if (!createdStatus) {
      logger.info(`登录名 ${user_name} 已存在, 请更换后重试!`);
      ctx.throwError(`登录名 ${user_name} 已存在, 请更换后重试!`);
    }

    return { operator_no };
  }

  async modifyOperator({ operator_no, role_no, user_name, password, nick_name, mobile, email, status }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;


    await PpOperator.update(
      {
        role_no,
        user_name,
        password,
        nick_name,
        mobile,
        email,
        status,
      },
      { where: { operator_no } }
    );

    logger.info(`operatorNo: ${operator_no} 修改操作员成功`);
  }

  async deleteOperator({ operator_no }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;

    await PpOperator.destroy(
      { where: { operator_no } }
    );

    logger.info(`operatorNo: ${operator_no} 删除操作员成功`);
    return operator_no;
  }

  async findByOperatorNo(operatorNo, validateLoginLock = true, validateDisabled = true) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;

    if (!operatorNo) {
      ctx.throwError('operatorNo不能为空');
      return;
    }

    const operator = await PpOperator.findOne({
      where: {
        operator_no: operatorNo,
      },
    });

    if (!operator) {
      ctx.throwError(`该账户 ${operatorNo} 不存在`);
    }

    if (validateLoginLock) {
      if (operator.lock_status === 'lock') {
        logger.info(`该账户 ${operatorNo} 已经被被锁定, 请联系管理员`);
        ctx.throwError(`该账户 ${operatorNo} 已经被被锁定, 请联系管理员`);
        return;
      }
    }

    if (validateDisabled) {
      if (operator.status === 'disabled') {
        logger.info(`该账户 ${operatorNo} 已经被停用, 请联系管理员`);
        ctx.throwError(`该账户 ${operatorNo} 已经被停用, 请联系管理员`);
        return;
      }
    }
    return operator;
  }


  // 这里的uname 可以是 表 operator user_name， mobile， email
  // 这里的pwd
  async findByLoginName({ loginName, appNo }) {
    const { ctx, logger, app } = this;
    const { model } = ctx;
    const { PpOperator } = model;
    const { Op } = app.Sequelize;

    if (!loginName) {
      ctx.throwError('账户名不能为空');
      return;
    }

    // step 1 find account
    const operator = await PpOperator.findOne({
      where: {
        [Op.and]: {
          app_no: appNo,
          [Op.or]: {
            user_name: loginName,
            mobile: loginName,
            email: loginName,
          },
        },
      },
    });

    return operator;
  }

  // 支持分页处理
  async list({ appNo, offset = 0, limit = 10, level = 0, roleNo, userName, nickName, mobile, email, status }) {
    const { ctx, logger, app, config } = this;
    const { model } = ctx;
    const { Sequelize } = app;
    const { PpOperator } = model;

    if (!appNo) {
      ctx.throwError('appNo 不能为空');
      return;
    }

    logger.info(`list appNo: ${appNo} roleNo: ${roleNo} 开始`);

    let whereCondition = `where r.level >= '${level}' `;

    if (appNo) {
      whereCondition += `and o.app_no = '${appNo}' `;
    }

    if (roleNo) {
      whereCondition += `and o.role_no = '${roleNo}' `;
    }

    if (userName) {
      whereCondition += `and o.user_name = '${userName}' `;
    }

    if (nickName) {
      whereCondition += `and o.nick_name = '${nickName}' `;
    }

    if (mobile) {
      whereCondition += `and o.mobile = '${mobile}' `;
    }

    if (email) {
      whereCondition += `and o.email = '${email}' `;
    }

    if (status) {
      whereCondition += `and o.status = '${status}' `;
    }

    const operatorList = {};
    const database = config.sequelize.database;
    await model.query(`
      SELECT * from ${database}.pp_operator as o
      INNER JOIN (SELECT ${database}.pp_role.level,${database}.pp_role.role_no from ${database}.pp_role) AS r  
      ON r.role_no = o.role_no
      ${whereCondition}
      ORDER BY o.created_at DESC LIMIT ${offset}, ${limit}
    `).spread(result => {
      operatorList.list = result;
    });

    await model.query(`
      SELECT count(1) as count from ${database}.pp_operator as o
      INNER JOIN (SELECT ${database}.pp_role.level,${database}.pp_role.role_no from ${database}.pp_role) AS r  
      ON r.role_no = o.role_no
      ${whereCondition}
    `).spread(result => {
      operatorList.count = Number(result[0].count);
    });

    logger.info(`list appNo: ${appNo} roleNo: ${roleNo} 结束`);

    return operatorList;

  }

  async modifyPassword({ operatorNo, password }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;

    await PpOperator.update(
      {
        password,
      },
      { where: { operator_no: operatorNo } }
    );

    logger.info(`operatorNo: ${operatorNo} 修改密码成功`);
  }

  async resetPassword({ operatorNo, password }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;

    await PpOperator.update(
      {
        password,
        lock_status: 'normal',
        login_err_times: 0,
      },
      { where: { operator_no: operatorNo } }
    );

    logger.info(`operatorNo: ${operatorNo} 重置密码成功`);
  }

  async modifyMobile({ operatorNo, mobile }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;

    await PpOperator.update(
      {
        mobile,
      },
      { where: { operator_no: operatorNo } }
    );

    logger.info(`operatorNo: ${operatorNo} 修改手机号成功`);
  }

  async modifyOptCode({ operatorNo, secret }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { PpOperator } = model;

    await PpOperator.update(
      {
        otp_key: secret,
      },
      { where: { operator_no: operatorNo } }
    );

    logger.info(`operatorNo: ${operatorNo} 修改动态口令成功`);
  }

  async operatorVerify(operator, system) {
    const { ctx, logger } = this;
    const { helper } = ctx;

    let appConfigObj = {};
    if (!system || Object.keys(system).length === 0) {
      appConfigObj = await this.service.base.appConfigService.findAppConfigObjByCondition({ app_no: operator.app_no });
    }
    const systemType = system || appConfigObj.system || {};
    // 如果未定义不存在，那么直接返回undefined，key不出现
    const fixFn = data => {
      return data === true || data === '1';
    };

    // app验证配置修正及默认值，这里跟操作员登陆授权相关，因此不该有默认值影响操作员本身的验证配置
    const isSms = helper.hasTake([ systemType.isSms ], fixFn);
    const isOtp = helper.hasTake([ systemType.isOtp ], fixFn);
    const isEmail = helper.hasTake([ systemType.isEmail ], fixFn);

    // 判断登陆操作员验证方式
    const SMS = isSms && !!operator.mobile;
    const OTP = isOtp && !!operator.otp_key;
    const EMAIL = isEmail && !!operator.email;

    return { SMS, OTP, EMAIL };
  }
}

module.exports = OperatorService;
