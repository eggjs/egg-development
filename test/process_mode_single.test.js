const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert');
const request = require('supertest');
const mm = require('egg-mock');
const { sleep } = require('./utils');

describe('test/process_mode_single.test.js', () => {
  let app;
  before(async () => {
    app = await require('egg').start({
      env: 'local',
      baseDir: path.join(__dirname, 'fixtures/development'),
      plugins: {
        development: {
          enable: true,
          path: path.join(__dirname, '..'),
        },
      },
    });
  });
  after(() => app.close());
  afterEach(mm.restore);

  it('should not reload', async () => {
    let warn = false;
    mm(app.agent.logger, 'warn', msg => {
      if (msg.includes('reload worker')) warn = true;
    });
    await request(app.callback()).get('/foo')
      .expect(200)
      .expect('foo');
    const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
    await fs.writeFile(filepath, '');
    await sleep(1000);

    await request(app.callback()).get('/foo')
      .expect(200)
      .expect('foo');

    await fs.unlink(filepath);

    await request(app.callback()).get('/foo')
      .expect(200)
      .expect('foo');

    assert(!warn);
  });
});

