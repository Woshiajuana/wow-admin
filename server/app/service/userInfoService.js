
'use strict';

const { Service } = require('egg');
const { populate, select } = require('./../model/userInfoModel');

module.exports = class HandleServer extends Service {

    // 创建管理用户
    async create (data) {
        const { ctx } = this;
        await ctx.model.UserInfoModel.create(data);
    }

    // 登录查询
    async auth ({ account, password }) {
        let objUser = await this.findOne({ nickname: account, password });
        if (!objUser)
            objUser = await this.findOne({ phone: account, password });
        if (!objUser)
            objUser = await this.findOne({ email: account, password });
        if (!objUser) throw '用户账号不存在或密码错误';
        return objUser;
    }

    // 查询用户信息
    async findOne (data) {
        const { ctx } = this;
        return await ctx.model.UserInfoModel.findOne(data).select(select).populate(populate).lean();
    }

    async findById (id) {
        const { ctx } = this;
        return await ctx.model.UserInfoModel.findById(data).select(select).populate(populate).lean();
    }


};
