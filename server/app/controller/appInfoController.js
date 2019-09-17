
'use strict';

const { Controller } = require('egg');

module.exports = class HandleController extends Controller {

    // 查询信息
    async info () {
        const { ctx, service, app } = this;
        try {
            const objApp = await service.appInfoService.find();
            ctx.respSuccess(objApp);
        } catch (e) {
            ctx.respError(e);
        }
    }

    // 创建信息
    async init () {
        const { ctx, service, app } = this;
        try {
            let {
                name,
                logo,
                theme,
                ownership,
                nickname,
                password,
                avatar,
                phone,
                email,
            } = await ctx.validateBody({
                name: [ 'nonempty' ],
                logo: [ 'nonempty' ],
                theme: [ 'nonempty' ],
                ownership: [ 'nonempty' ],
                username: [ 'nonempty' ],
                password: [ 'nonempty' ],
                avatar: [ 'nonempty' ],
                phone: [ 'nonempty' ],
                email: [ 'nonempty' ],
            });
            // 判断 APP 是否已初始化
            await service.appInfoService.count();
            // 初始化 APP
            await service.appInfoService.init({
                name,
                logo,
                theme,
                ownership,
            });
            // 初始化超级管理员用户组
            let admin = await service.userGroupService.create({
                name: '超级管理员',
                is_root_group: true,
            });
            console.log(admin);
            // 初始化超级管理员用户
            await service.userInfoService.create({
                nickname,
                password,
                avatar,
                phone,
                email,
            });
            ctx.respSuccess();
        } catch (e) {
            ctx.respError(e);
        }
    }

};
