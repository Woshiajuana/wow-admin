
import axios from 'axios'
import _ from 'lodash'

class Http {

    constructor (api, data, options) {
        this.api = api;
        this.data = Object.assign({}, data);
        this.options = Object.assign({
            method: 'POST',
            timeout: 3000,
        }, options);
        return this._curl();
    }

    _curl () {
        return new Promise((resolve, reject) => {
            this._log('请求参数 => ', this.data);
            let { callbackSuccess, callbackError } = this.options;
            axios({
                ...this.options,
                url: this.api,
                data: this.data,
                params: this.data,
            }).then((res) => {
                this._log('请求成功：返回参数 => ', res);
                console.log(res);
                resolve(res);
            }).catch((err) => {
                this._log('请求失败：返回参数 => ', err);
                console.log(err);
                reject(err);
            });
        });
    }

    _log () {
        console.log(this.api, '\n',  this.options.method, ...arguments)
    }

}

export default (config) => {
    const fn = (api, data, options) => {
        return new Http(api, data, _.merge({}, options, config));
    };
    fn.get = (api, data, options) => {
        return new Http(api, data, _.merge(options, config, { method: 'GET' }));
    };
    fn.post = (api, data, options) => {
        return new Http(api, data, _.merge(options, config, { method: 'POST' }));
    };
    return fn;
};

