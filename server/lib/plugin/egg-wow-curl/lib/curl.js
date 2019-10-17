
'use strict';

const egg = require('egg');


class CurlService extends egg.Service {

    constructor(ctx, name) {
        super(ctx, name);
        const strName = name || this.constructor.name;
        this.options = Object.assign({}, ctx.app.config.curl[strName] || {});
    }

    async afterRequest (response) {
        let {
            status,
            statusMessage,
            data,
        } = response;
        const strErrMsg = data.msg || data.message || statusMessage;
        if (status >= 300 || status < 200 || data.code !== 'S00000')
            throw `[${status}]：${strErrMsg}`;
        return response.data ? response.data.data : response;
    }

    async beforeRequest (options) {
        return options;
    }

    async curl (url, options) {
        let {
            baseUrl,
        } = options = Object.assign({
            method: 'POST',
            dataType: 'json',
        }, this.options, options);
        url = `${baseUrl}${url}`;
        options = await this.beforeRequest(options);
        let response = await this.ctx.curl(url, options);
        response = await this.afterRequest(response);
        return response;
    }
}

Object.assign(egg, {
    CurlService,
});

function createClient(config, app) {
    return {};
}

module.exports = app => {
    app.addSingleton('curlSuper', createClient);
};
