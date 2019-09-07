
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
            ctx.respSuccess(objApp);
        } catch (e) {
            ctx.respError(e);
        }
    }

    // 创建信息
    async create () {
        const { ctx, service, app } = this;
        try {
            let objParams = await ctx.validateBody({
                name: [ 'nonempty' ],
                logo: [ 'nonempty' ],
                theme: [ 'nonempty' ],
                ownership: [ 'nonempty' ],
            });
            await ctx.model.AppInfoModel.create(objParams);
            ctx.respSuccess();
        } catch (e) {
            ctx.respError(e);
        }
    }

};
