
import Config           from '@/config'

class Http {

    constructor (api, data, options) {
        this.api = api;
        this.data = Object.assign({}, data);
        this.options = Object.assign({}, options);
    }

    _curl () {

    }

    _log () {
        console.log(this.api, '\n',  this.options.method, ...arguments)
    }

}

function fn (api = '', data = {}, options = {}) {
    return new Http(api, data, options);
}

export default fn;
