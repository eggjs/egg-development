const { setTimeout: sleep } = require('node:timers/promises');
const fs = require('node:fs/promises');
const path = require('node:path');
const mm = require('egg-mock');
const { escape } = require('./utils');

describe('test/not-reload.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    mm(process.env, 'EGG_DEBUG', true);
    app = mm.cluster({
      baseDir: 'not-reload',
      opt: {
        execArgv: [ '--inspect' ],
      },
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should not reload', async () => {
    const filepath = path.join(__dirname, 'fixtures/not-reload/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    await fs.unlink(filepath);
    app.notExpect('stdout', new RegExp(escape(`reload worker because ${filepath} change`)));
  });
});

