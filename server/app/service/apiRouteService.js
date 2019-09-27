
'use strict';

const { Service } = require('egg');

module.exports = class HandleServer extends Service {

    // 初始化
    async init () {
        const { ctx } = this;
        const { apiRoutes } = require('./../router');
        await ctx.model.ApiRouteModel.insertMany(apiRoutes, { ordered: false });
    }

    // 创建
    async create (data) {
        const { ctx } = this;
        await ctx.model.ApiRouteModel.create(data);
    }

    // 根据 id 查询
    async findById (id) {
        const { ctx } = this;
        return await ctx.model.ApiRouteModel
            .findById(id)
            .lean();
    }

    // 列表
    async list ({ numIndex, numSize, name }) {
        const { ctx } = this;
        if (numIndex && numSize) {
            let filter = { $or: [] }; // 多字段同事匹配
            if (name) {
                filter.$or.push({ name: { $regex: name, $options: '$i' } });
            }
            if (!filter.$or.length) delete filter.$or;
            const numTotal = await ctx.model.ApiRouteModel.count(filter);
            const arrData = await ctx.model.ApiRouteModel
                .find(filter)
                .sort('-created_at')
                .skip((numIndex - 1) * numSize)
                .limit(numSize)
                .lean();
            return {
                arrData,
                numTotal,
                numIndex,
                numSize,
            }
        } else {
            const arrData = await ctx.model.ApiRouteModel
                .find().sort('-created_at').lean();
            return arrData;
        }
    }

    // 删除
    async del (id) {
        const { ctx, app } = this;
        await ctx.model.ApiRouteModel.remove({ _id: app.mongoose.Types.ObjectId(id) });
    }

    // 更新
    async update (data) {
        const { ctx, app } = this;
        const { id } = data;
        delete data.id;
        await ctx.model.ApiRouteModel.update({ _id: app.mongoose.Types.ObjectId(id) }, data);
    }
};