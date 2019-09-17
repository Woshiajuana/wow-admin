'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 获取 APP 应用信息
    router.post('/api/v1/app/info', controller.appInfoController.info);
    // APP 应用信息初始化
    router.post('/api/v1/app/init', controller.appInfoController.init);

};
