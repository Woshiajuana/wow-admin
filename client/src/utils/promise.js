
import modal from '@utils/modal'

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

Promise.prototype.null = function () {
    return this.catch(err => {
        err && console.log(err);
    });
};

Promise.prototype.toast = function () {
    return this.catch(err => {
        if (typeof err === 'object') {
            err = err.respMessage || JSON.stringify(err);
        }
        modal.toast(err, 'error');
    });
};
