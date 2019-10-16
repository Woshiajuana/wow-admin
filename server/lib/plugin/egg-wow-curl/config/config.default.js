'use strict';

/**
 * egg-wow-validate default config
 * @member Config#validate
 * @property {String} SOME_KEY - some description
 */
exports.curl = {
    app: true,
    agent: false,
    client: {
        mode: 'one',
        trim: true,
        regular: {},
        errPrompt: {
            common: '参数错误',
            nonempty: '缺少必要参数',
            rule: '参数格式错误',
        },
    },
};
