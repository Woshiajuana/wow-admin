
'use strict';

const { Controller } = require('egg');

module.exports = class AppInfoController extends Controller {

    // 查询信息
    async get () {
        const { ctx, service, app } = this;
        try {
            const [ objApp ] = await ctx.model.AppInfoModel.find();
            if (!objApp) throw 'F00001';
            ctx.respSuccess(objApp);
        } catch (e) {
            ctx.respError(e);
        }
    }

    // 创建信息
    async set () {
        const { ctx, service, app } = this;
        try {
            let objParams = await ctx.validateBody({
                name: [ 'nonempty' ],
                logo: [ 'nonempty' ],
                theme: [ 'nonempty' ],
                ownership: [ 'nonempty' ],
            });
            const numCount = await ctx.model.AppInfoModel.count();
            if (numCount) throw '已设置 APP，不能重复设置，请刷新页面...';
            await ctx.model.AppInfoModel.create(objParams);
            ctx.respSuccess();
        } catch (e) {
            ctx.respError(e);
        }
    }

};
