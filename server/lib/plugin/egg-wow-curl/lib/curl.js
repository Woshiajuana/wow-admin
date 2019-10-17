
'use strict';

const egg = require('egg');

class Service extends egg.Service {
    constructor(ctx, name) {
        super(ctx);
        console.log('到这里Service => ', this.constructor.name);
        const serviceName = name || this.constructor.name;
        this.options = Object.assign({}, ctx.app.config.curl[serviceName]);
    }
}

class CurlService extends Service {

    constructor(ctx, name) {
        super(ctx, name);
        console.log('到这里CurlService => ', this.constructor.name);
        this.options = Object.assign({}, this.options);
    }

    async afterRequest (response) {
        return response.data || response;
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
    app.addSingleton('curlSuper', createClient);
};
