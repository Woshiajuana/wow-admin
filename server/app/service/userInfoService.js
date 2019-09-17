
'use strict';

const { Service } = require('egg');
const { populate, select, listSelect } = require('./../model/userInfoModel');

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

    // 生成 token
    async token (objUser) {
        const { app } = this;
        objUser.access_token = app.jwt.sign(objUser, app.config.jwt.secret);
        return objUser;
    }

    // 查询用户信息
    async findOne (data) {
        const { ctx } = this;
        return await ctx.model.UserInfoModel
            .findOne(data)
            .select(select)
            .populate(populate)
            .lean();
    }

    // 根据 id 查询用户信息
    async findById (id) {
        const { ctx } = this;
        return await ctx.model.UserInfoModel
            .findById(id)
            .select(select)
            .populate(populate)
            .lean();
    }

    // 用户列表
    async list ({ numIndex, numSize }) {
        const { ctx } = this;
        const numTotal = await ctx.model.UserInfoModel.count();
        const arrData = await ctx.model.UserInfoModel
            .find()
            .sort('-create_at')
            .skip((numIndex - 1) * numSize)
            .limit(numSize)
            .select(listSelect)
            .lean();
        return {
            numTotal,
            numIndex,
            numSize,
            arrData,
        }
    }

};
