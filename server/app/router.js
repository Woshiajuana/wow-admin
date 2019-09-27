'use strict';

const apiRoutes =  [
    {
        name: '查询管理员用户组列表',
        path: '/api/v1/user-group/list',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userGroupController.list ],
    },
    {
        name: '创建管理员用户组',
        path: '/api/v1/user-group/create',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userGroupController.create ],
    },
    {
        name: '更新管理员用户组',
        path: '/api/v1/user-group/update',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userGroupController.update ],
    },
    {
        name: '删除管理员用户组',
        path: '/api/v1/user-group/delete',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userGroupController.del ],
    },


    {
        name: '查询管理员用户列表',
        path: '/api/v1/user-info/list',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userInfoController.list ],
    },
    {
        name: '创建管理员用户',
        path: '/api/v1/user-info/create',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userInfoController.create ],
    },
    {
        name: '更新管理员用户',
        path: '/api/v1/user-info/update',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userInfoController.update ],
    },
    {
        name: '删除管理员用户',
        path: '/api/v1/user-info/delete',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userInfoController.del ],
    },
];

module.apiRoutes = apiRoutes;

module.exports = app => {
    const { router, controller, middleware } = app;
    // 获取应用基础信息
    router.post('/api/v1/app/info', controller.appInfoController.info);
    // 初始化应用信息
    router.post('/api/v1/app/init', controller.appInfoController.init);
    // 管理员用户授权登录
    router.post('/api/v1/user-info/login', controller.userInfoController.login);
    // 初始化路由
    apiRoutes.forEach((item) => {
        let { path, handler, method } = Object.assign({ method: 'POST' }, item);
        router[method.toLocaleLowerCase()](path, ...handler(app));
    });
};
