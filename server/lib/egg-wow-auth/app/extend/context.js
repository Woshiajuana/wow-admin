'use strict';

const jwt = require('jsonwebtoken');
const JWT = Symbol('Application#jwt');
const ms = require('ms');

class Token {
    constructor(ctx, props = {}, options) {
        this.ctx = ctx;
        this.options = options;
        for (let key in props) {
            this[key] = props[key];
        }
        // id
        if (!this.id) {
            throw new Error('Token id is empty!');
        }
        // 客户端信息
        if (!this.client) {
            this.client = this.options.getClientInfo(this.ctx);
        }
        const timeStamp = new Date().getTime();
        // 创建时间
        if (!this.createAt) {
            this.createAt = timeStamp;
        }
        // 更新时间
        if (!this.updateAt) {
            this.updateAt = timeStamp;
        }
        if (!props.hasOwnProperty('isDead')) {
            this.isDead = false;
        }
        // token
        if (!this.accessToken) {
            this.accessToken = `acst:${this.id}:${jwt.sign(`${this.id}`, this.options.secret, this.options)}`;
        }
    }

    // 判断是不是同一台设备
    judgeClient () {
        return this.client === this.options.getClientInfo(this.ctx);
    }

    // toJSON
    toJSON() {
        const obj = {};
        Object.keys(this).forEach(key => {
            if (typeof key !== 'string') return;
            if (key[0] === '_') return;
            if (this[key] === undefined) return;
            obj[key] = this[key];
        });
        return obj;
    }

    // 保存
    async save () {
        const { logger } = this.ctx;
        const { redis } = this.ctx.app;
        await redis.set(this.accessToken, JSON.stringify(this.toJSON()), 'PX', ms(this.options.maxAge) * 0.001);
    }

    // 更新时间
    async active () {
        const { redis } = this.ctx.app;
        await redis.expire(this.accessToken, ms(this.options.maxAge) * 0.001);
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
    async generateToken (data, options) {
        const { app, logger } = this;
        console.log('配置=》', Object.assign({}, app.config.auth, options))
        return new Token(this, data, Object.assign({}, app.config.auth, options));
    },

    //
    async getTokenByAccessToken () {

    },

    //
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

