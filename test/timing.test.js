'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
const sleep = require('mz-modules/sleep');
const assert = require('assert');


describe('test/timing.test.js', () => {
  const timingJSON = path.join(__dirname, 'fixtures/timing/run/agent_timing_11111.json');
  const configJSON = path.join(__dirname, 'fixtures/timing/run/application_config.json');
  let app;
  before(function* () {
    yield mkdirp(path.dirname(timingJSON));
    yield fs.writeFile(timingJSON, '[]');
    yield fs.writeFile(configJSON, '{}');
    mm.env('local');
    app = mm.cluster({
      baseDir: 'timing',
    });
    yield app.ready();
  });
  after(() => app.close());

  it('should clean all timing json in agent', function* () {
    yield app.httpRequest()
      .get('/checkFile')
      .expect({
        timing: false,
        config: true,
      });
  });

  it('should render page', function* () {
    yield sleep(1000);

    const res = yield app.httpRequest()
      .get('/__loader_trace__');

    let json = res.text.match(/data = (.*?);/);
    json = JSON.parse(json[1]);
    assert(json.length === 100);

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
