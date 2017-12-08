'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const sleep = require('mz-modules/sleep');

describe('test/override.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.cluster({
      baseDir: 'override',
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should reload', async () => {
    const filepath = path.join(__dirname, 'fixtures/override/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    await fs.unlink(filepath);
    app.expect('stdout', new RegExp(`reload worker because ${filepath}`));
  });

  it('should not reload', async () => {
    app.debug();
    const filepath = path.join(__dirname, 'fixtures/override/app/no-trigger/index.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    // await fs.unlink(filepath);
    app.notExpect('stdout', new RegExp(`reload worker because ${filepath} change`));
  });
});

