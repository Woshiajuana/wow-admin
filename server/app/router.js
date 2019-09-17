'use strict';

const apiRoutes =  [
    {
        name: '获取应用基础信息',
        path: '/api/v1/app/info',
        handler: ({ controller }) => [ controller.appInfoController.info ],
    },
    {
        name: '应用信息初始化',
        path: '/api/v1/app/init',
        handler: ({ controller }) => [ controller.appInfoController.init ],
    },
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
];

module.apiRoutes = apiRoutes;

module.exports = app => {
    const { router, controller } = app;

    apiRoutes.forEach((item) => {
        let { path, handler, method } = Object.assign({ method: 'POST' }, item);
        router[method.toLocaleLowerCase()](path, ...handler(app))
    });

};
