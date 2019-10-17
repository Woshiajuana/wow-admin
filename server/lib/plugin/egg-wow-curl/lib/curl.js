
'use strict';

const egg = require('egg');

class Service extends egg.Service {

    constructor(ctx, name) {
        super(ctx);

        const serviceName = name || this.constructor.name;
        this.opts = Object.assign({}, ctx.app.config[serviceName]);
    }
}

class CurlService extends Service {

    constructor(ctx, name) {
        super(ctx, name);
        this.opts = Object.assign({
            apiName: '',
            apiUrl: '',
            fromRealIp: false,
            curlOptions: {},
        }, this.opts);
    }

    async afterRequest(response, opts) {
        let respError;
        const data = response.data || {};

        if (response.status >= 300 || response.status < 200 ||
            data.respCode !== 'S0001') {

            respError = new Error(data.respMessage || data.message || '服务异常');
            respError.normalResponse = true;
            respError.errCode = data.respCode || 'F500';
            respError.status = response.status;
            throw respError;
        }

        return data.data;
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
    Service,
});

function createClient(config, app) {
    return {};
}

module.exports = app => {
    app.addSingleton('curl', createClient);
};
