
import axios from 'axios'
import _ from 'lodash'

class Http {

    constructor (api, data, options) {
        this.api = api;
        this.data = Object.assign({}, data);
        this.options = options;
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
            }).then((response) => {
                this._log('请求成功：返回数据 => ', response);
                let { status, data: result, statusText } = response;
                if (status !== 200)
                    return reject(statusText);
                let { code, msg, data } = result;
                this._log('请求成功：返回参数 => ', result);
                if (code !== 'S00000')
                    return reject(result);
                resolve(data);
            }).catch((err) => {
                let { response = {} } = err;
                this._log('请求失败：返回参数 => ', response);
                let { status, statusText } = response;
                reject(statusText || err);
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

