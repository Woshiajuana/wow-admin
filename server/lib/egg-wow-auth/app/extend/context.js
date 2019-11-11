'use strict';

const jwt = require('jsonwebtoken');
const JWT = Symbol('Application#jwt');
const ms = require('ms');

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


    async authGetToken (key, value, options = {}) {
        const { app, logger } = this;
        const { redis } = app;
        const { secret, maxAge } = Object.assign({}, app.config.auth, options);
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

// 获取客户端信息
function getClientInfo (ctx) {
    const { request, ips = [], ip = '' } = ctx;
    const deviceUUID = request.headers['device-uuid'] || '';
    const userAgent = ctx.get('user-agent') || '';
    const ipAddress = ips && ips.length ? ips.join('-') : ip || '';
    return `${ipAddress}:${userAgent}:${deviceUUID}`;
}
