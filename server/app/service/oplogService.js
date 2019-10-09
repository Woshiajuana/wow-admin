
'use strict';

const { Service } = require('egg');
const { populate } = require('./../model/oplogModel');

module.exports = class HandleServer extends Service {

    // 创建
    async create (data) {
        const { ctx } = this;
        await ctx.model.OplogModel.create(data);
    }

    // 根据 id 查询
    async findById (id) {
        const { ctx } = this;
        return await ctx.model.OplogModel
            .findById(id)
            .lean();
    }

    // 列表
    async list ({ numIndex, numSize, name, path, method }) {
        const { ctx } = this;
        if (numIndex && numSize) {
            let filter = { $or: [] }; // 多字段同事匹配
            if (name) {
                filter.$or.push({ name: { $regex: name, $options: '$i' } });
            }
            if (path) {
                filter.$or.push({ path: { $regex: path, $options: '$i' } });
            }
            if (method) {
                filter.$or.push({ method: { $regex: method, $options: '$i' } });
            }
            if (!filter.$or.length) delete filter.$or;
            const numTotal = await ctx.model.OplogModel.count(filter);
            const arrData = await ctx.model.OplogModel
                .find(filter)
                .sort('-created_at')
                .skip((numIndex - 1) * numSize)
                .limit(numSize)
                .populate(populate)
                .lean();
            return {
                arrData,
                numTotal,
                numIndex,
                numSize,
            }
        } else {
            const arrData = await ctx.model.OplogModel
                .find().sort('-created_at').lean();
            return arrData;
        }
    }

    // 删除
    async del (id) {
        const { ctx, app } = this;
        await ctx.model.OplogModel.remove({ _id: app.mongoose.Types.ObjectId(id) });
    }

};
