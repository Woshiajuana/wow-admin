
import { Message } from 'element-ui'

export default {
    toast (options = '', key = 'info') {
        const stringOptions = Object.prototype.toString.apply(options);
        const isObjectOptions = stringOptions === '[object Object]';
        const isErrorOptions = stringOptions === '[object Error]';
        let msg = isObjectOptions
            ? options.msg || options.message || JSON.stringify(options)
            : isErrorOptions
                ? options.toString()
                : options;
        Message[key](msg);
    }
}
