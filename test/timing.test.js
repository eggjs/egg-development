const assert = require('node:assert');
const fs = require('node:fs/promises');
const path = require('node:path');
const { setTimeout: sleep } = require('node:timers/promises');
const mm = require('egg-mock');

describe('test/timing.test.js', () => {
  const timingJSON = path.join(__dirname, 'fixtures/timing/run/agent_timing_11111.json');
  const configJSON = path.join(__dirname, 'fixtures/timing/run/application_config.json');
  let app;
  before(async () => {
    await fs.mkdir(path.dirname(timingJSON), { recursive: true });
    await fs.writeFile(timingJSON, '[]');
    await fs.writeFile(configJSON, '{}');
    mm.env('local');
    app = mm.cluster({
      baseDir: 'timing',
    });
    await app.ready();
  });
  after(() => app.close());

  it('should clean all timing json in agent', async () => {
    await app.httpRequest()
      .get('/checkFile')
      .expect({
        timing: false,
        config: true,
      });
  });

  it('should render page', async () => {
    await sleep(1000);

    const res = await app.httpRequest()
      .get('/__loader_trace__');

    let json = res.text.match(/data = (.*?);/);
    json = JSON.parse(json[1]);
    assert(json.length === 111);

    const first = json[0];
    assert(first.type === 'agent');
    assert(typeof first.pid === 'string');
    assert.deepEqual(first.range, [ first.start, first.end ]);
    assert(first.title === 'agent(0)');

    const last = json[json.length - 1];
    assert(/^app_\d+$/.test(last.type));
    assert(typeof last.pid === 'string');
    assert.deepEqual(last.range, [ last.start, last.end ]);
    assert(/^app_\d+\(65\)$/.test(last.title));
  });
});
