'use strict';

module.exports = function(app) {
  app.get('/foo.js', function* () {
    this.body = 'foo.js';
  });

  app.get('/foo', function* () {
    this.body = 'foo';
  });
};
