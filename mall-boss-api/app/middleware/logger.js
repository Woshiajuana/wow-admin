'use strict';

module.exports = (recordInfo, options) => {
  return async function (ctx, next) {
    const { logger, service } = ctx;
    const { recordAll = false } = options || {};

    const isRecord = recordAll || recordInfo.group;
    const targetUrl = ctx.params[0] && ctx.params[0].startsWith('/') ? ctx.params[0] : '/' + ctx.params[0];
    const record = recordInfo[targetUrl] || (isRecord ? recordInfo : '')

    const { recordFail = false, when = 'after', group = '', name = '', level = '' } = record || {};
    try {
      if (record && when === 'before') {
        logger.info('=======================');
        logger.info('请求之前开始记录日志.');
        service.base.loggerService.log({ group, name, level });
      }
      await next();
      if (record && when === 'after') {
        logger.info('=======================');
        logger.info('请求之后开始记录日志.');
        service.base.loggerService.log({ group, name, level });
      }
    } catch (err) {
      if (record && recordFail) {
        logger.info('=======================');
        logger.info('请求报错开始记录日志.');
        service.base.loggerService.log({ group, name, level });
      }

      throw err;
    }
  };
};
