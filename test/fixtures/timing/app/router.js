'use strict';

module.exports = app => {
  app.get('/checkFile', function* () {
    this.body = String(this.app.checkFile);
  });
};
