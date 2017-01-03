'use strict';

const mm = require('egg-mock');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const sleep = require('ko-sleep');

function trimLogPrefix(log) {
  return log.replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d+ INFO \d+ /, '');
}

describe('fastReady = false', () => {
  const logpath = path.join(__dirname, './fixtures/delayed-development/logs/delayed-development/delayed-development-web.log');
  const fakeDefaultConfigPath = path.join(__dirname, './fixtures/delayed-development/config/config.default.js');

  function startApp() {
    mm(process.env, 'NODE_ENV', 'development');
    mm(process.env, 'EGG_LOG', 'none');
    return mm.app({
      baseDir: 'delayed-development',
      // plugin: 'development',
      cache: false,
      clean: true,
    });
  }

  afterEach(() => {
    if (fs.existsSync(fakeDefaultConfigPath)) {
      fs.unlinkSync(fakeDefaultConfigPath);
    }
    mm.restore();
  });

  it('should fast ready by default', function* () {
    const app = startApp();
    yield app.ready();
    // We need to wait for log written, because app.logger.info is async.
    yield sleep(100);

    const content = fs.readFileSync(logpath, 'utf8');
    const lines = content.trim().split('\n');
    assert(lines.length === 1, 'lines.length === 1');
    assert(trimLogPrefix(lines[0]) === 'Server started.');
  });

  it('should not fast ready if config.development.fastReady is false', function* () {
    fs.writeFileSync(fakeDefaultConfigPath, 'exports.development = { fastReady: false };');

    const app = startApp();
    yield app.ready();
    // We need to wait for log written, because app.logger.info is async.
    yield sleep(300);

    const content = fs.readFileSync(logpath, 'utf8');
    const lines = content.trim().split('\n');
    assert(lines.length === 2, 'lines.length === 2');
    assert(trimLogPrefix(lines[0]) === 'delayed 200ms done.');
    assert(trimLogPrefix(lines[1]) === 'Server started.');
  });
});
