/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = appInfo => {

    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1557904782826_8085';

    // add your middleware config here
    config.middleware = [];

    // add redis
    config.redis = {
        client: {
            port: 6379,
            host: '127.0.0.1',
            password: '123456',
            db: 0,
        },
    };

    // add cors
    

    // add email
    config.email = {
        client: {
            host: 'smtp.mxhichina.com', // 主机
            secureConnection: true, // 使用 SSL
            port: 465, // SMTP 端口
            auth: {
                user: 'zhigang.chen@owulia.com',
                pass: 'liujiaoyan1120/',
            },
        },
    };

    // add validate
    config.validate = {
        client: {
            regular: {},
        },
    };

    // add response
    config.response = {
        client: {},
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
        view: {
            defaultViewEngine: 'nunjucks',
            mapping: {
                '.tpl': 'nunjucks',
            },
        },
    };

    return {
        ...config,
        ...userConfig,
    };
};
