'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const sleep = require('mz-modules/sleep');

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

  it('should reload', async () => {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    await fs.unlink(filepath);
    app.notExpect('stdout', new RegExp(`reload worker because ${filepath} change`));
  });
});

