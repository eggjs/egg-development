'use strict';

module.exports = app => {
  // don't need to wait at local development mode
  if (app.config.development.fastReady) process.nextTick(() => app.ready(true));
};
