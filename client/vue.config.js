'use strict';

const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

// 具体配置参数 https://cli.vuejs.org/config/
module.exports = {
    publicPath: './',
    // outputDir: 'dist',
    // assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        name: 'Wow-Admin',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
};
