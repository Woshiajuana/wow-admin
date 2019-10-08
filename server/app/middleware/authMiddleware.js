
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
            const {
                group,
                is_root,
            } = ctx.state.user;
            const {
                is_root_group,
                api_routes,
            } = group || {};
            if (is_root || is_root_group || checkApiRoutes(path, method, api_routes)) {

            } else {
                throw '';
            }
            await next();
        } catch (err) {
            ctx.respError(err);
        }
    }
};

function checkApiRoutes (path, method, routes) {
    return routes.filter((item) => item.path === path && item.method === method).length > 0;
}
