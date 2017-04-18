'use strict';

const mm = require('egg-mock');
const fs = require('fs');
const path = require('path');
const sleep = require('ko-sleep');

describe('test/not-reload.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.cluster({
      baseDir: 'not-reload',
    });
    return app.ready();
  });
  after(() => app.close());

  it('should reload', function* () {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
    fs.writeFileSync(filepath, '');
    yield sleep(1000);

    fs.unlinkSync(filepath);
    app.notExpect('stdout', new RegExp(`reload worker because ${filepath} change`));
  });
});

