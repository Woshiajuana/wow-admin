
'use strict';

const { Controller } = require('egg');

module.exports = class AppInfoController extends Controller {

    // 查询信息
    async info () {
        const { ctx, service, app } = this;
        try {
            const arrData = await ctx.model.AppInfoModel.find();
            const { domain } = ctx.query;
            

            console.log('ctx.model1 => ', arrData);
            console.log('ctx.domain => ', domain);
        } catch (e) {
            ctx.respError(e);
        }
    }

};
