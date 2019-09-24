
'use strict';

const { Service } = require('egg');
const { populate, select, listSelect } = require('./../model/userInfoModel');
const ms = require('ms');

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
        const { ctx, app, config } = this;
        const { redis } = app;
        const numMaxAge = ms(config.jwt.maxAge || '10m');
        const strToken = ctx.jwt.sign(objUser);
        await redis.set(strToken, objUser, 'EX', numMaxAge * 0.001);
        objUser.access_token = strToken;
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
    async list ({ numIndex, numSize, email, group, nickname, phone }) {
        const { ctx, app} = this;
        let filter = {
            $or: [  // 多字段同时匹配
                { email: { $regex: new RegExp(email || '', 'i') } },
                { nickname: { $regex: new RegExp(nickname || '', 'i') } },
                { phone: { $regex: new RegExp(phone || '', 'i') } },
            ]
        };
        if (group) {
            group = app.mongoose.Types.ObjectId(group);
            filter.$or.push({ group: group })
        }
        const numTotal = await ctx.model.UserInfoModel.count(filter);
        const arrData = await ctx.model.UserInfoModel
            .find(filter)
            .sort('-create_at')
            .skip((numIndex - 1) * numSize)
            .limit(numSize)
            .select(select)
            .populate(populate)
            .lean();
        return {
            numTotal,
            numIndex,
            numSize,
            arrData,
        }
    }

};
