'use strict';

const ms = require('ms');
const moment = require('moment');
const Service = require('egg').Service;
const randomstring = require('randomstring');

module.exports = class SmsService extends Service {

  async createCaptcha(mobile) {
    const { ctx, logger, app } = this;
    const { redis } = app;

    const datetime = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    const captcha = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    const smsMsg = JSON.stringify({
      captcha,
      datetime,
    });

    logger.info(`sendSmsCaptcha mobile:${mobile} captcha: ${captcha}`);

    if (!mobile) {
      ctx.throwError('手机号不能为空', 'F400');
      return;
    }

    const smsMaxAge = ms(this.opts.smsMaxAge || '5m');
    const redisKey = `captcha:${mobile}`;

    logger.info(`sendSmsCaptcha Complete. mobile:${mobile} captcha: ${captcha} 有效期 ${smsMaxAge}`);

    await redis.set(redisKey, captcha, 'EX', smsMaxAge * 0.001);

    return captcha;
  }

  async verifySmsCaptcha(mobile, captcha, remove) {
    const ctx = this.ctx;
    const { logger } = ctx;
    const { redis } = ctx.app;

    const redisKey = `captcha:${mobile}`;
    const redisCaptcha = await redis.get(redisKey);
    if (redisCaptcha !== captcha) {
      logger.info(`mobile: ${mobile} 验证校验不同通过 redisCaptcha: ${redisCaptcha} captcha: ${captcha}`);

      return false;
    }

    if (remove) {
      await redis.del(redisKey);
    }

    return true;
  }

  async invalidSmsCaptcha(mobile, captcha) {
    const ctx = this.ctx;
    const { logger } = ctx;
    const { redis } = ctx.app;

    const redisKey = `captcha:${mobile}`;
    await redis.del(redisKey);

    logger.info(`让 mobile: ${mobile} captcha ${captcha} 失效`);
  }
};

