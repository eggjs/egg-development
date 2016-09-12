'use strict';

const request = require('supertest');
const pedding = require('pedding');
const rimraf = require('rimraf');
const mm = require('egg-mock');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
let app;

const logpath = path.join(__dirname, 'fixtures/development/logs/development/development-web.log');
const logpath_agent = path.join(__dirname, 'fixtures/development/logs/development/egg-agent.log');

describe('test/development.test.js', () => {
  before(done => {
    rimraf.sync(logpath);
    rimraf.sync(logpath_agent);
    mm(process.env, 'NODE_ENV', 'development');
    mm(process.env, 'EGG_LOG', 'none');
    app = mm.app({
      baseDir: 'development',
      plugin: 'development',
    });
    app.ready(done);
  });

  afterEach(mm.restore);

  it('should log status', done => {
    done = pedding(3, done);
    setTimeout(() => {
      const content = fs.readFileSync(logpath, 'utf8');
      assert(content.trim().split('\n').every(line => /status/.test(line)), content);
      done();
    }, 500);
    request(app.callback())
    .get('/foo')
    .expect(200, done);

    request(app.callback())
    .get('/not_exist')
    .expect(404, done);
  });

  it('should ignore assets', done => {
    done = pedding(4, done);
    mm(app.logger, 'info', msg => {
      if (msg.match(/status /)) {
        throw new Error('should not log status');
      }
    });

    request(app.callback())
    .get('/foo.js')
    .expect(200)
    .end(done);

    request(app.callback())
    .get('/public/hello')
    .expect(404, done);

    request(app.callback())
    .get('/assets/hello')
    .expect(404, done);

    request(app.callback())
    .get('/__koa_mock_scene_toolbox/hello')
    .expect(404, done);
  });

  it('should reload once when 2 file change as same time', done => {
    const filepath = path.join(__dirname, 'fixtures/development/app/service/c.js');
    const filepath1 = path.join(__dirname, 'fixtures/development/app/service/d.js');
    fs.writeFileSync(filepath, '');
    fs.writeFileSync(filepath1, '');

    setTimeout(() => {
      const content = fs.readFileSync(logpath_agent, 'utf8').trim();
      assert.equal(content.split('reload worker').length, 2);

      fs.unlinkSync(filepath);
      fs.unlinkSync(filepath1);
      done();
    }, 1000);
  });
});
