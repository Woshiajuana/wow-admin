
'use strict';

const { Service } = require('egg');

module.exports = class HandleServer extends Service {

    // 创建用户组
    async create (data) {
        const { ctx } = this;
        return await ctx.model.UserGroupModel.create(data);
    }



};
