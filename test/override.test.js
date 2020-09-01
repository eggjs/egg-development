'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const sleep = require('mz-modules/sleep');
const { escape } = require('./utils');

describe('test/override.test.js', () => {
  let app;

  after(() => app && app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  describe('overrideDefault', () => {
    before(() => {
      mm.env('local');
      app = mm.cluster({
        baseDir: 'override',
      });
      app.debug();
      return app.ready();
    });
    it('should reload', async () => {
      const filepath = path.join(__dirname, 'fixtures/override/app/service/a.js');
      await fs.writeFile(filepath, '');
      await sleep(1000);

      await fs.unlink(filepath);
      app.expect('stdout', new RegExp(escape(`reload worker because ${filepath}`)));
    });

    it('should not reload', async () => {
      app.debug();
      const filepath = path.join(__dirname, 'fixtures/override/app/no-trigger/index.js');
      await fs.writeFile(filepath, '');
      await sleep(1000);

      await fs.unlink(filepath);
      app.notExpect('stdout', new RegExp(escape(`reload worker because ${filepath} change`)));
    });
  });

  describe('overrideIgnore', () => {
    before(() => {
      mm.env('local');
      app = mm.cluster({
        baseDir: 'override-ignore',
      });
      app.debug();
      return app.ready();
    });
    it('should reload', async () => {
      const filepath = path.join(__dirname, 'fixtures/override-ignore/app/web/a.js');
      await fs.writeFile(filepath, '');
      await sleep(1000);

      await fs.unlink(filepath);
      app.expect('stdout', new RegExp(escape(`reload worker because ${filepath}`)));
    });

    it('should not reload', async () => {
      app.debug();
      const filepath = path.join(__dirname, 'fixtures/override-ignore/app/public/index.js');
      await fs.writeFile(filepath, '');
      await sleep(1000);

      await fs.unlink(filepath);
      app.notExpect('stdout', new RegExp(escape(`reload worker because ${filepath} change`)));
    });
  });
});
