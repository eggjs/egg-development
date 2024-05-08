const fs = require('node:fs/promises');
const path = require('node:path');
const mm = require('egg-mock');
const { sleep } = require('./utils');

describe('test/absolute.test.js', () => {
  let app;
  before(async () => {
    await fs.rm(path.join(__dirname, 'fixtures/absolute/lib'), { force: true, recursive: true });

    // FIXME: ONLY WATCH EXIST DIR
    const filepath = path.join(__dirname, 'fixtures/absolute/lib/a/b.js');
    await fs.mkdir(path.dirname(filepath), { recursive: true });
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
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    console.log(`write file to ${filepath}`);
    await fs.writeFile(filepath, 'console.log(1);');
    await sleep(5000);

    await fs.unlink(filepath);
    app.expect('stdout', /reload worker because .*?b\.js/);
  });

});
