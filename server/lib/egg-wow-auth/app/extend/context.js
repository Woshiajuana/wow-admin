'use strict';

const jwt = require('jsonwebtoken');
const JWT = Symbol('Application#jwt');
const ms = require('ms');


class AccessTokenData {
    constructor(ctx, props = {}) {
        for (let key in props) {
            this[key] = props[key];
        }
        const timeStamp = new Date().getTime();
        // 客户端信息
        if () {

        }
        // 创建时间
        if (!this.createAt) {
            this.createAt = timeStamp;
        }
        // 更新时间
        if (!this.updateAt) {
            this.updateAt = timeStamp;
        }

    }
}

module.exports = {
    get jwt () {
        if (!this[JWT]) {
            let {
                app,
                logger,
            } = this;
            const config = app.config.auth;
            let { secret } = config;
            this[JWT] = {
                decode: jwt.decode,
                UnauthorizedError: jwt.UnauthorizedError,
            };
            this[JWT].verify = (jwtString, secretOrPublicKey, options = {}) => {
                return jwt.verify(
                    jwtString,
                    secretOrPublicKey || secret,
                    Object.assign({}, options),
                );
            };
            this[JWT].sign = (payload, secretOrPrivateKey, options = {}) => {
                return jwt.sign(
                    payload,
                    secretOrPrivateKey || secret,
                    Object.assign({}, options)
                );
            };
        }
        return this[JWT];
    },

    // 生成 token
    async auhtGenerateAccessToken () {

    },

    //
    async authGetAccessTokenByToken () {

    },

    async authGetToken (key, value, options = {}) {
        const { app, logger } = this;
        const { redis } = app;
        const { secret, maxAge, getClientInfo } = Object.assign({}, app.config.auth, options);
        const numMaxAge = ms(maxAge || '10m') * 0.001;
        const strClient = getClientInfo(this);
        if (typeof key === 'object') key = JSON.stringify(key);
        if (typeof value === 'object') value = JSON.stringify(value);
        const strToken = jwt.sign(`${key}:${strClient}`, secret, options);
        await redis.set(strToken, value, 'EX', numMaxAge);
        logger.info(`用户:【${key}】在客户端:【${strClient}】上登录，生成 token:【${strToken}】, 有效期:【${maxAge}】.`);
        return strToken;
    },



};

