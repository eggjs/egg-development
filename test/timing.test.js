'use strict';

const mm = require('egg-mock');
const fs = require('mz/fs');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');


describe.only('test/timing.test.js', () => {
  const timingJSON = path.join(__dirname, 'fixtures/timing/run/agent_timing_11111.json');
  let app;
  before(function* () {
    yield mkdirp(path.dirname(timingJSON));
    yield fs.writeFile(timingJSON, '[]');
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
      .expect('false');
  });

  it('should clean all timing json in agent', function* () {
    const res = yield app.httpRequest()
      .get('/__loader_trace__');

    const json = res.text.match(/data = (.*?);/);
    console.log(JSON.parse(json));
  });
});
