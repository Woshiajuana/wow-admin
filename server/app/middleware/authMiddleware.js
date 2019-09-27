
'use strict';

module.exports = () => {
    return async function (ctx, next) {
        const {
            logger,
            request,
            query,
            app,
        } = ctx;
        try {
            let {
                method,
                path,
            } = request;
            const objUser = ctx.state.user;
            console.log('method => ', method);
            console.log('path => ', path);
            console.log('objUser => ', objUser);
            await next();
        } catch (err) {
            ctx.respError(err);
        }
    }
};
