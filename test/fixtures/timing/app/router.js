'use strict';

module.exports = app => {
  app.get('/checkFile', function* () {
    this.body = this.app.checkFile;
  });
};
