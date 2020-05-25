'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const sleep = require('mz-modules/sleep');
const assert = require('assert');
const { escape } = require('./utils');

describe('test/development.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.cluster({
      baseDir: 'development',
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should reload when change service', async () => {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    await fs.unlink(filepath);
    app.expect('stdout', new RegExp(escape(`reload worker because ${filepath}`)));
  });

  it('should not reload when change assets', async () => {
    const filepath = path.join(__dirname, 'fixtures/development/app/assets/b.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    await fs.unlink(filepath);
    app.notExpect('stdout', new RegExp(escape(`reload worker because ${filepath}`)));
  });

  it('should reload once when 2 file change', async () => {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/c.js');
    const filepath1 = path.join(__dirname, 'fixtures/development/app/service/d.js');
    await fs.writeFile(filepath, '');
    // set a timeout for watcher's interval
    await sleep(1000);
    await fs.writeFile(filepath1, '');

    await sleep(2000);
    await fs.unlink(filepath);
    await fs.unlink(filepath1);

    assert(count(app.stdout, 'reload worker'), 2);
  });
});

function count(str, match) {
  return str.match(new RegExp(match, 'g'));
}
