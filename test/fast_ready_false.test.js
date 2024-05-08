const mm = require('egg-mock');
const { sleep } = require('./utils');

describe('fastReady = false', () => {
  let app;
  beforeEach(() => {
    mm(process.env, 'NODE_ENV', 'development');
  });
  afterEach(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should fast ready by default', async () => {
    app = mm.cluster({
      baseDir: 'delay-ready',
    });
    await app.ready();
    // We need to wait for log written, because app.logger.info is async.
    await sleep(100);

    app.expect('stdout', /Server started./);
  });

  it('should not fast ready if config.development.fastReady is false', async () => {
    app = mm.cluster({
      baseDir: 'fast-ready',
    });
    await app.ready();
    // We need to wait for log written, because app.logger.info is async.
    await sleep(300);

    app.expect('stdout', /delayed 200ms done./);
    app.expect('stdout', /Server started./);
  });
});
