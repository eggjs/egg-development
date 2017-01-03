'use strict';

module.exports = app => {
  app.config.coreMiddleware.unshift('development');

  // don't need to wait at local development mode
  if (app.config.development.fastReady) process.nextTick(() => app.ready(true));
};
