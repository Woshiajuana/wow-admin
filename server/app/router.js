'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/api/v1/app/info', controller.AppInfoController.info);
    router.get('/register', controller.view.register);
    router.post('/user/register', controller.user.register);
    router.post('/code/email/send', controller.captcha.sendToEmail);
};
