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
            host: '47.95.202.71',
            port: '6379',
            db: '0',
            family: 'IPv4',
            password: 'zbDHVaWOgMdV4rPQ3wETRYfRFjlEos83',
        },
    };

    // add cors
    config.cors = {
        origin: '*', // 访问白名单,根据你自己的需要进行设置
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };

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

    config.mongoose = {
        url: 'mongodb://47.95.202.71:27017/wow_admin',
        password: 'wow_admin123',
        options: {
            user: 'wow_admin',
            pass: 'wow_admin123',
            password: 'wow_admin123',
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
