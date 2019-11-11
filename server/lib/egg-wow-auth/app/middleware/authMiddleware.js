
'use strict';

const ms = require('ms');

module.exports = (options = {}) => {
    return async function authMiddleware (ctx, next) {
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

            const accessToken = request.headers['access-token']
                || request.body.access_token
                || query.access_token;

            // 没有 accessToken
            if (!accessToken)
                throw 'F40000';


            const strUser = await redis.get(accessToken);
            if (!strUser)
                throw 'F40002';

            const numMaxAge = ms(app.config.jwt.maxAge || '10m');

            await redis.set(accessToken, strUser, 'EX', numMaxAge * 0.001);

            ctx.state.user = Object.assign({ accessToken }, JSON.parse(strUser));

            await next();
        } catch (err) {
            ctx.respError(err);
        }
    };
};
