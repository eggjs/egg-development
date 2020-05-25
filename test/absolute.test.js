'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const { rimraf, mkdirp, sleep } = require('mz-modules');

describe('test/absolute.test.js', () => {
  let app;
  before(async () => {
    await rimraf(path.join(__dirname, 'fixtures/absolute/lib'));

    // FIXME: ONLY WATCH EXIST DIR
    const filepath = path.join(__dirname, 'fixtures/absolute/lib/a/b.js');
    await mkdirp(path.dirname(filepath));
    await fs.writeFile(filepath, '');

    mm.env('local');
    app = mm.cluster({
      baseDir: 'absolute',
      debug: true,
    });
    return app.ready();
  });
  after(() => app.close());
  afterEach(mm.restore);
  // for debounce
  afterEach(() => sleep(500));

  it('should reload at absolute path', async () => {
    const filepath = path.join(__dirname, 'fixtures/absolute/lib/a/b.js');
    await mkdirp(path.dirname(filepath));
    console.log(`write file to ${filepath}`);
    await fs.writeFile(filepath, 'console.log(1);');
    await sleep(5000);

    await fs.unlink(filepath);
    app.expect('stdout', /reload worker because .*?b\.js/);
  });

});
