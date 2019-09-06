'use strict';

const Service = require('egg').APIService;

module.exports = class ScoreMallService extends Service {

  constructor(ctx) {
    super(ctx, 'ScoreMallService');
    this.opts.curlOptions.contentType = 'json';
  }

  beforeRequest(opts) {
    const { ctx } = this;

    if (!opts.headers) opts.headers = {};

    opts.headers['from-real-ip'] = ctx.ip;
  }

  afterRequest(response, opts) {
    let respError;
    const resData = response.data || {};

    if (opts.hasNoCodeAndMsg) {
      return resData;
    }

    const data = { // 兼容两种风格
      respCode: resData.code || resData.respCode,
      respMessage: resData.msg || resData.respMessage,
      data: resData.data,
    };

    if (response.status >= 300 || response.status < 200 ||
        data.respCode !== 'S0001') {

      respError = new Error(data.respMessage || data.message || '服务异常');
      respError.normalResponse = true;
      respError.errCode = data.respCode || 'F500';
      respError.status = response.status;
      throw respError;
    }

    return data.data;
  }
};
