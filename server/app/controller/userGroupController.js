
'use strict';

const { Controller } = require('egg');

module.exports = class HandleController extends Controller {

    async create () {

    }

    async list () {
        const { ctx, service, app } = this;
        try {
            const objParams = await ctx.validateBody({
                numIndex: [],
                numSize: [],
            });
            const data = await service.userGroupService.list(objParams);
            ctx.respSuccess(data);
        } catch (err) {
            ctx.respError(err);
        }
    }

};
