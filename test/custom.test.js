const fs = require('fs/promises');
const path = require('node:path');
const { setTimeout: sleep } = require('node:timers/promises');
const mm = require('egg-mock');
const { escape } = require('./utils');

describe('test/custom.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.cluster({
      baseDir: 'custom',
    });
    app.debug();
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should reload with custom detect', async () => {
    let filepath;
    filepath = path.join(__dirname, 'fixtures/custom/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(5000);

    await fs.unlink(filepath);
    app.expect('stdout', new RegExp(escape(`reload worker because ${filepath}`)));

    filepath = path.join(__dirname, 'fixtures/custom/app/service/b.ts');
    await fs.writeFile(filepath, '');
    await sleep(5000);

    await fs.unlink(filepath);
    app.notExpect('stdout', new RegExp(escape(`reload worker because ${filepath}`)));
  });
});
