
'use strict';

const { Controller } = require('egg');

module.exports = class AppInfoController extends Controller {

    // 查询信息
    async info () {
        const { ctx, service, app } = this;
        try {
            const { objApp } = await ctx.model.AppInfoModel.find();
            const { domain } = ctx.query;
            if (!objApp) throw new Error('APP');

        } catch (e) {
            console.log(Object.prototype.toString.apply(e));
            ctx.respError(e);
        }
    }

};
