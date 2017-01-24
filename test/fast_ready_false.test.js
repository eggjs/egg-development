'use strict';

const mm = require('egg-mock');
const sleep = require('ko-sleep');

describe('fastReady = false', () => {
  let app;
  beforeEach(() => {
    mm(process.env, 'NODE_ENV', 'development');
  });
  afterEach(() => app.close());
  afterEach(mm.restore);

  it('should fast ready by default', function* () {
    app = mm.cluster({
      baseDir: 'delay-ready',
    });
    yield app.ready();
    // We need to wait for log written, because app.logger.info is async.
    yield sleep(100);

    app.expect('stdout', /Server started./);
  });

  it('should not fast ready if config.development.fastReady is false', function* () {
    app = mm.cluster({
      baseDir: 'fast-ready',
    });
    yield app.ready();
    // We need to wait for log written, because app.logger.info is async.
    yield sleep(300);

    app.expect('stdout', /delayed 200ms done./);
    app.expect('stdout', /Server started./);
  });
});
