'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
const ms = require('ms');
const moment = require('moment');

module.exports = class SessionService extends Service {

  // 这里的login_name 可以是 表 operator user_name， mobile， email
  async loginPassword({ login_name, password }) {
    const { ctx, logger, app } = this;
    const { model, authData } = ctx;
    const { PpOperator } = model;
    const { Op } = app.Sequelize;

    if (!login_name || !password) {
      ctx.throwError('账户或密码不能为空', 'F400');
      return;
    }

    // step 1 find account
    const operator = await PpOperator.findOne({
      where: {
        [Op.or]: {
          user_name: login_name,
          mobile: login_name,
          email: login_name,
        },
      },
    });

    if (!operator) {
      logger.info(`账户 ${login_name} 不存在`);
      ctx.throwError('账户或密码错误');
      return;
    }

    if (operator.lock_status === 'lock') {
      logger.info(`该账户 ${login_name} 已经被被锁定, 请联系管理员`);
      ctx.throwError(`该账户 ${login_name} 已经被被锁定, 请联系管理员`);
      return;
    }

    if (operator.status === 'disabled') {
      logger.info(`该账户 ${login_name} 已经被停用, 请联系管理员`);
      ctx.throwError(`该账户 ${login_name} 已经被停用, 请联系管理员`);
      return;
    }

    operator.last_login_ip = ctx.ip;

    if (password !== operator.password) {

      operator.login_err_times += 1;

      const leftTryLoginTimes = operator.login_max_err_times - operator.login_err_times;
      if (leftTryLoginTimes <= 0) {
        operator.lock_status = 'lock';
        await operator.save();
        logger.info(`该账户 ${login_name} 已达最大错误尝试次数，被被锁定, 请联系管理员`);
        ctx.throwError(`该账户 ${login_name} 已达最大错误尝试次数，被被锁定, 请联系管理员`);
      } else {
        await operator.save();
        logger.info(`该账户 ${login_name} 密码校验错误, 你还剩余 ${leftTryLoginTimes}次 尝试机会`);
        ctx.throwError(`该账户 ${login_name} 密码校验错误, 你还剩余 ${leftTryLoginTimes}次 尝试机会`);
      }
      return;
    }

    operator.login_err_times = 0;
    operator.lock_status = 'normal';
    await operator.save();

    return operator;
  }

  async kickOffUser(userId, maxUserLoginCount = 1) {
    const { ctx, logger, app } = this;

    // 预踢掉在线用户
    let otherAccessDatas = await ctx.findAccessDatasByUserId(userId) || [];
    otherAccessDatas = otherAccessDatas.sort((a, b) => {
      // 根据create_at 排序 老的在前面 新的在后面
      return a.createAt < b.createAt ? 1 : -1;
    });

    if (maxUserLoginCount <= 0) return;
    const template = maxUserLoginCount === 1 ? 'kickoff-by-modify-password' : 'kickoff-by-login';

    const needKickoffUserCount = otherAccessDatas.length - maxUserLoginCount + 1;
    if (needKickoffUserCount > 0) {
      const kickoffAccessDatas = otherAccessDatas.slice(0, needKickoffUserCount);
      for (const kickoffAccessData of kickoffAccessDatas) {
        kickoffAccessData.maxAge = ms('5m');
        kickoffAccessData.isDead = true;
        kickoffAccessData.message = ctx.__(template,
          moment().format('YYYY-MM-DD HH:mm'),
          `IP: ${ctx.ip} ${ctx.userAgent.ua}`);
        await kickoffAccessData.save(true);
        logger.info(`预踢掉在线用户 operator_no ${kickoffAccessData.id} token: ${kickoffAccessData.accessToken}`);
      }
    }
  }
};
