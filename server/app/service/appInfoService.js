
'use strict';

const { Service } = require('egg');

module.exports = class AppInfoService extends Service {

    async find () {
        const { ctx } = this;
        const [ objApp ] = await ctx.model.AppInfoModel.find();
        if (!objApp) throw 'F00001';
        return objApp;
    }

    async count () {
        const { ctx } = this;
        const numCount = await ctx.model.AppInfoModel.count();
        if (numCount) throw '已设置 APP，不能重复设置，请刷新页面...';
        return numCount;
    }

    async create (data) {
        const { ctx } = this;
        await ctx.model.AppInfoModel.create(data);
    }

};
