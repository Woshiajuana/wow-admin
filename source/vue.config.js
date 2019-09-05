'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    publicPath: './',
    // outputDir: 'dist',
    // assetsDir: 'static',
    lintOnSave: false,
    devServer: {
        port: 8081,
    },
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
