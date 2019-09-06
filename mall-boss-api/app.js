'use strict';

module.exports = app => {
  const { logger, config } = app;

  app.beforeStart(async function() {
    logger.info('=============================== app start');
    logger.info(`http://127.0.0.1:${config.cluster.listen.port}/public/apidoc/index.html`);
  });
};
