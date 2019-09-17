'use strict';

const { Controller } = require('egg');

module.exports = class HandleController extends Controller {

    // 创建管理员
    async create () {
        const { ctx, service, app } = this;
        try {
            let { email, password, captcha } = await ctx.validateBody({
                email: [ 'nonempty', 'isEmail' ],
                captcha: [ 'nonempty' ],
                password: [ 'nonempty' ],
            });
            await service.captcha.checkByEmail(email, captcha);
            ctx.respSuccess();
        } catch (err) {
            ctx.respError(err);
        }
    }

    // 授权登录
    async login () {
        const { ctx, service, app } = this;
        try {
            let {
                account,
                password,
                captcha,
            } = await ctx.validateBody({
                account: [ 'nonempty' ],
                password: [ 'nonempty' ],
                captcha: [],
            });
            let objUser = await service.userInfoService.auth({ account, password });
            ctx.respSuccess(objUser);
        } catch (err) {
            ctx.respError(err);
        }
    }

    // 授权验证

};
