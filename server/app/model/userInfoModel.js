
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

        // 密码
        password: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },

        // 头像
        avatar: {
            type: String,
            trim: true,
            required: true,
        },

        // 手机
        phone: {
            type: String,
            trim: true,
            maxlength: 13,
        },

        // 邮箱
        email: {
            type: String,
            trim: true,
            maxlength: 30,
        },

        // 用户组
        group: {
            type: Schema.Types.ObjectId,
            ref: 'user_group',
        },

        // 是否是 root账号
        is_root: {
            type: Boolean,
            default: false,
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
    return mongoose.model('user_info', postSchema);
};
