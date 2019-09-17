
'use strict';

const { Service } = require('egg');

module.exports = class HandleServer extends Service {

    // 创建管理用户
    async create (data) {
        const { ctx } = this;
        await ctx.model.UserInfoModel.create(data);
    }



};
