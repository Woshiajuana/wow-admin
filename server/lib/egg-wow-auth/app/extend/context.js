'use strict';

const jwt = require('jsonwebtoken');
const JWT = Symbol('Application#jwt');
const AUTH = Symbol('Application#auth');
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

    get auth () {
        if (!this[AUTH]) {
            let {
                app,
                logger,
                ctx,
            } = this;
            const { redis } = app;
            this[AUTH] = {
                async getToken (key, value, options) {
                    const { secret, maxAge } = Object.assign({}, app.config.auth, options);
                    if (typeof key === 'object') key = JSON.stringify(key);
                    if (typeof value === 'object') value = JSON.stringify(value);
                    const numMaxAge = ms(maxAge || '10m');
                    const token = jwt.sign(key, secret, options);
                    // await redis.set(token);
                    console.log('==============')
                    const deviceUUID = request.headers['device-uuid'] || '';
                    const userAgent = ctx.get('user-agent') || '';

                    let ipAddress = '';
                    if (!deviceUUID) {
                        ipAddress = (ctx.ips && ctx.ips.length ? ctx.ips.join('-') : undefined) || ctx.ip || '';
                    }
                    console.log('deviceUUID => ', deviceUUID)
                    console.log('ctx.ips => ', ctx.ips)
                    console.log('ctx.ip => ', ctx.ip)
                    console.log('ipAddress => ', ipAddress)
                    console.log('userAgent => ', userAgent)

                    console.log('==============')
                }

            };
        }
        return this[AUTH];
    }
};


function getClientMac(ctx) {
    const request = ctx.request;
    const deviceUUID = request.headers['device-uuid'] || '';
    let ipAddress = '';
    if (!deviceUUID && ctx.app.config.limitRequest.ipEnable) {
        ipAddress = (ctx.ips && ctx.ips.length ? ctx.ips.join('-') : undefined) || ctx.ip || '';
    }

    const userAgent = ctx.get('user-agent') || '';

    const clientMacContent = `${ipAddress}:${userAgent}:${deviceUUID}`;
    return crypto.createHash('md5').update(clientMacContent).digest('hex');
}
