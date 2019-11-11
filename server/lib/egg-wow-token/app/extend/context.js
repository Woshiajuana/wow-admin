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
            this.accessToken = `acst:${this.id}:${jwt.sign({ id: this.id, createAt: this.createAt }, this.options.secret, this.options.jwtOption || {})}`;
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
        logger.info(`redis 创建用户: 【${this.id}, 数据 accessToken:【${this.accessToken}】 有效期:【${this.options.maxAge}】`);
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
            const config = app.config.token;
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
        const token =  new Token(this, data, Object.assign({}, app.config.token, options));
        await token.save();
        return token;
    },

    // 根据 accessToken 获取
    async getTokenByAccessToken (accessToken) {
        const { app, logger } = this;
        const { redis } = app;
        const strToken = await redis.get(accessToken);
        if (strToken) {
            logger.info(`redis 获取 accessData 数据 accessToken: ${accessToken} 失败 不存在!`);
            throw `F40000`;
        }
        let objToken = null;
        try {
            objToken = JSON.parse(strToken);
        } catch (err) {
            logger.info(`accessData:${ accessToken } 数据解析错误: ${err.message} ${strToken}`);
            throw `F40000`;
        }
        if (!objToken) {
            logger.info(`redis 获取 accessToken: ${accessToken} 为空！`);
            throw `F40000`;
        }
        return new Token(this, objToken);
    },


};

