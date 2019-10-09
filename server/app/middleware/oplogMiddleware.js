
'use strict';

module.exports = () => {
    return async function (ctx, next) {
        await next();
        const {
            logger,
            request,
            query,
            app,
            body,
            state,
        } = ctx;
        const {
            method,
            path,
            body: data,
        } = request;
        let {
            _id,
        } = state.user;
        if (path === '/api/v1/user-info/login') {
            _id = body._id;
        }

        console.log('请求接口 => ', path, method);
        console.log('请求参数 => ', data);
        console.log('操作员 => ', state.user);
        console.log('操作结果 => ', body);
    }
};
