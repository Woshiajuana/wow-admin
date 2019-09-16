'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/api/v1/app/info', controller.appInfoController.info);
    router.post('/api/v1/app/init', controller.appInfoController.init);
};
