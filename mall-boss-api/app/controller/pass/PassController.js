'use strict';

const Controller = require('egg').Controller;

// 配置日志记录
// middlewares.logger(info,config)
// config.recordAll = true; 记录全部
const loggerMapping = {
  // '/v1.0/user/grade/update': { group: '会员', name: '变更级别', level: '2' },
};

module.exports = class PassController extends Controller {

  static route(app, middlewares, controller) {
    app.router.all(
      '/api/pass/pass/*',
      middlewares.accessToken(),
      middlewares.logger(loggerMapping),
      controller.transform);
  }

  async transform() {
    const { ctx } = this;
    const targetUrl = ctx.params[0].startsWith('/') ? ctx.paramsp[0] : '/' + ctx.params[0];

    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;

    const data = await this.service.passService.curl(targetUrl, {
      method: ctx.method,
      data: requestData,
    });

    ctx.formatSuccessResp({ data });
  }
};
