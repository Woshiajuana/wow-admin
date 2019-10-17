
'use strict';

const { Controller } = require('egg');

module.exports = class HandleController extends Controller {

    // 转发
    async transform () {
        const { ctx, service, app } = this;
        try {
            console.log('ctx.params => ', ctx.params);
            console.log('ctx.method => ', ctx.method);
            console.log('ctx.query => ', ctx.query);
            console.log('ctx.body => ', ctx.body);
            console.log('ctx.request.path => ', ctx.request.path);
            // const targetUrl = ctx.params[0].startsWith('/') ? ctx.params[0] : '/' + ctx.params[0];
            // const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
            // console.log('requestData =========> ', requestData)
            // const data = await this.service.pass.bossOldService.curl(targetUrl, {
            //     method: ctx.method,
            //     data: requestData,
            // });
            ctx.respSuccess();
        } catch (err) {
            ctx.respError(err);
        }
    }

};
