'use strict';

const path = require('path');

// 页面模块
exports.nunjucks = {
    enable: true,
    package: 'egg-view-nunjucks',
};

// redis
exports.redis = {
    enable: true,
    package: 'egg-redis',
};

// 跨域
exports.cors = {
    enable: true,
    package: 'egg-cors',
};

// 数据库mongoose
export.

// 发送邮件
exports.email = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-wow-email'),
};

// 验证参数
exports.validate = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-wow-validate'),
};

// 响应
exports.response = {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-wow-response'),
};
