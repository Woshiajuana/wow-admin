
'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const postSchema = new Schema({

        // 名称
        name: {
            type: String,
            trim: true,
            minlength: 2,
            maxlength: 20,
            default: '',
        },

        // 路由权限 or 菜单权限
        routes: {
            type: Array,
            default: [],
        },

        // 接口权限
        api: {
            type: Array,
            default: [],
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
    return mongoose.model('user_group', postSchema);
};
