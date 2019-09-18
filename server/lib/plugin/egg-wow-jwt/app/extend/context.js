'use strict';

const jwt = require('jsonwebtoken');
const JWT = Symbol('Application#jwt');

module.exports = {
    haha: 'xxx',

    get jwt () {
        if (!this[JWT]) {
            const config = this.config.jwt;
            console.log('config => ', config);
            this[JWT] = {};
            this[JWT].verify = async (jwtString, secretOrPublicKey, options) => {
                return new Promise((resolve, reject) => {
                    jwt.verify(
                        jwtString,
                        secretOrPublicKey,
                        options,
                        (res) => resolve(res)
                    );
                });
            };

            this[JWT].sign = async (payload, secretOrPrivateKey, options) => {
                return new Promise((resolve, reject) => {
                    jwt.sign(
                        payload,
                        secretOrPrivateKey,
                        Object.assign({}, config, options),
                        (res) => resolve(res)
                    );
                });
            };
        }
        return this[JWT];
    }
};
