'use strict';

const apiRoutes =  [
    {
        name: '创建用户组',
        path: '/api/v1/user-group/create',
        handler: ({ controller }) => [ controller.userGroupController.create ],
    },
    {
        name: '创建用户管理员',
        path: '/api/v1/user-info/create',
        handler: ({ controller }) => [ controller.userInfoController.create ],
    },
    {
        name: '查询管理员用户列表',
        path: '/api/v1/user-info/list',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userInfoController.list ],
    },
    {
        name: '查询管理员用户组列表',
        path: '/api/v1/user-group/list',
        handler: ({ controller, middleware }) => [ middleware.jwtMiddleware(), controller.userGroupController.list ],
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
