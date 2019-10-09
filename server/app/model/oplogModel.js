
'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const postSchema = new Schema({

        // 名称
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user_info',
            require: true,
        },

        // API
        api: {
            type: Schema.Types.ObjectId,
            ref: 'api_route',
            require: true,
        },

        // 结果
        result: {
            type: Object,
            require: true,
        },

        // 创建时间
        created_at: {
            type: Date,
            default: Date.now,
        },

        // 更新时间
        updated_at: {
            type: Date,
            default: Date.now,
        },

    });
    return mongoose.model('oplog', postSchema);
};
