
'use strict';

module.exports = () => {
    return async function (ctx, next) {
        await next();
        try {
            const {
                logger,
                request,
                query,
                app,
                body,
                state,
                service,
            } = ctx;
            const {
                method,
                path,
                body: data,
            } = request;
            let {
                _id: userId,
            } = state.user || {};
            if (path === '/api/v1/user-info/login') {
                userId = body.data._id;
            }
            let {
                _id: apiId,
            } = await service.apiRouteService.findOne({ path, method });
            await service.oplogService.create({
                user: userId,
                api: apiId,
                result: { code: body.code, msg: body.msg },
            });
        } catch (e) {
            console.log(e);
        }
    }
};
