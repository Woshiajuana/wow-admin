'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // const { middlewares } = app;

  require('./controller/home').route(app);

  // require('./controller/console/debug').route(app);

  router.batchRoute('console');

  router.batchRoute('base/v1/utlis');
  router.batchRoute('base/v1/operator');
  router.batchRoute('base/v1');

  router.batchRoute('pass');
  router.batchRoute('biz');
  router.batchRoute('biz/app');
  router.batchRoute('biz/other');
};
