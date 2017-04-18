'use strict';

const mm = require('egg-mock');
const fs = require('fs');
const path = require('path');
const sleep = require('ko-sleep');
const assert = require('assert');

describe('test/development.test.js', () => {
  let app;
  before(() => {
    mm.env('local');
    app = mm.cluster({
      baseDir: 'development',
    });
    return app.ready();
  });
  after(() => app.close());

  it('should reload when change service', function* () {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
    fs.writeFileSync(filepath, '');
    yield sleep(1000);

    fs.unlinkSync(filepath);
    app.expect('stdout', new RegExp(`reload worker because ${filepath}`));
  });

  it('should not reload when change assets', function* () {
    const filepath = path.join(__dirname, 'fixtures/development/app/assets/b.js');
    fs.writeFileSync(filepath, '');
    yield sleep(1000);

    fs.unlinkSync(filepath);
    app.notExpect('stdout', new RegExp(`reload worker because ${filepath}`));
  });

  it('should reload once when 2 file change', function* () {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/c.js');
    const filepath1 = path.join(__dirname, 'fixtures/development/app/service/d.js');
    fs.writeFileSync(filepath, '');
    // set a timeout for watcher's interval
    yield sleep(1000);
    fs.writeFileSync(filepath1, '');

    yield sleep(2000);
    fs.unlinkSync(filepath);
    fs.unlinkSync(filepath1);

    assert(count(app.stdout, 'reload worker'), 2);
  });
});

function count(str, match) {
  return str.match(new RegExp(match, 'g'));
}
