
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
                throw 'F40001';
            const objUser = redis.get(accessToken);
            if (!objUser)
                throw 'F40003';
            ctx.state.user = objUser;
            await next();
        } catch (err) {
            ctx.respError(err);
        }
    };
};
