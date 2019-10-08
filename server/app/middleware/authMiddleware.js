
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
            console.log('ctx.state.user => ', ctx.state.user);

            const {
                group,
                is_root,
            } = JSON.parse(ctx.state.user);
            const {
                is_root_group,
                api_routes,
            } = group || {};
            console.log('is_root => ', is_root);
            console.log('ctx.state.user => ', ctx.state.user);
            console.log('method => ', method);
            console.log('path => ', path);
            console.log('is_root_group => ', is_root_group);
            console.log('api_routes => ', api_routes);
            await next();
        } catch (err) {
            ctx.respError(err);
        }
    }
};
