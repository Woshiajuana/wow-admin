
'use strict';

const { Controller } = require('egg');

module.exports = class HandleController extends Controller {

    // 菜单创建
    async info () {
        const { ctx, service, app } = this;
        try {
            const objApp = await service.appInfoService.find();
            ctx.respSuccess(objApp);
        } catch (e) {
            ctx.respError(e);
        }
    }

    // 创建信息
    async init () {
        const { ctx, service, app } = this;
        try {
            let objParams = await ctx.validateBody({
                name: [ 'nonempty' ],
                logo: [ 'nonempty' ],
                theme: [ 'nonempty' ],
                ownership: [ 'nonempty' ],
            });
            await service.appInfoService.count();
            await service.appInfoService.create(objParams);
            ctx.respSuccess();
        } catch (e) {
            ctx.respError(e);
        }
    }

};
