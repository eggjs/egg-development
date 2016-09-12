'use strict';

module.exports = function(app) {
  app.config.coreMiddleware.unshift('development');

  // don't need to wait at local development mode
  process.nextTick(() => app.ready(true));
};
