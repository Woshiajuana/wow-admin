
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
            const objUser = await redis.get(accessToken);
            if (!objUser)
                throw 'F40003';
            console.log('验证 token')
            console.log('objUser => ', objUser);
            ctx.state.user = JSON.stringify(objUser);
            await next();
        } catch (err) {
            ctx.respError(err);
        }
    };
};
