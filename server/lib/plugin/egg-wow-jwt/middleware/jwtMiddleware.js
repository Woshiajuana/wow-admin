
'use strict';

module.exports = (options = {}) => {
    return async function (ctx, next) {
        const {
            logger,
            request,
            query,
            app,
        } = ctx;
        let {
            redis,
        } = app;
        try {
            const accessToken = request.headers['access-token'] || request.body.access_token || query.access_token;
            if (!accessToken)
                throw 'token 未设置';
            if ()
        } catch (err) {
            ctx.respError(err);
        }
    };
};
