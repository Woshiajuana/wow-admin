'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
    jwt: {

        async verify (jwtString, secretOrPublicKey, options) {
            return new Promise((resolve, reject) => {
                jwt.verify(jwtString, secretOrPublicKey, options, (res) => {
                    resolve(res);
                });
            });
        },

        async sign () {



        },
    }
};
