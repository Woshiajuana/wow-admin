
'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const postSchema = new Schema({

        // 菜单名称
        title: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 20,
        },

        // 路径
        path: {
            type: String,
            trim: true,
            required: true,
        },

        params: {
            type: String,
            trim: true,
            default: '',
        },

        // 父路由
        father: {
            type: Schema.Types.ObjectId,
            ref: 'menu_route',
        },

        // 排序
        sort: {
            type: Number,
            trim: true,
            require: true,
        },

        // 组件
        component: {
            type: String,
            trim: true,
            required: true,
        },

        // icon
        icon: {
            type: String,
            trim: true,
            default: '',
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
    return mongoose.model('menu_route', postSchema);
};
