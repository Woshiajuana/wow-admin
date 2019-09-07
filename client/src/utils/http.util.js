
import Config           from '@/config'
import axios            from 'axios'

class Http {

    constructor (api, data, options) {
        this.api = api;
        this.data = Object.assign({}, data);
        this.options = Object.assign({
            method: 'POST',
            baseURL: Config.baseURL,
            timeout: 10000,
        }, options);
        this._curl();
    }

    _curl () {
        this._log('请求参数 => ', this.data);
        axios({
            url: this.api,
            ...this.options,
            data: this.data,
            params: this.data,
        }).then((res) => {
            this._log('请求成功：返回参数 => ', res);
            console.log(res);
        }).catch((err) => {
            this._log('请求失败：返回参数 => ', err);
            console.log(err);
        });
    }

    _log () {
        console.log(this.api, '\n',  this.options.method, ...arguments)
    }

}

function fn (api = '', data = {}, options = {}) {
    return new Http(api, data, options);
}

export default fn;
