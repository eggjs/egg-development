/**!
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   苏千 <suqian.yf@alipay.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const mm = require('egg-mock');
const fs = require('fs');
const path = require('path');

describe('test/development.test.js', () => {

  describe('EGG_DEBUG = ""', function() {
    let app;
    before(done => {
      mm.env('local');
      app = mm.cluster({
        baseDir: 'development',
      });
      setTimeout(done, 5000);
    });
    after(mm.restore);
    after(() => app.close());

    it('should reload when change service', function(done) {
      const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
      fs.writeFileSync(filepath, '');
      setTimeout(function() {
        fs.unlinkSync(filepath);
        app.expect('stdout', new RegExp(`reload worker because ${filepath}`));
        done();
      }, 1000);
    });

    it('should not reload when change assets', function(done) {
      const filepath = path.join(__dirname, 'fixtures/development/app/assets/b.js');
      fs.writeFileSync(filepath, '');
      setTimeout(function() {
        fs.unlinkSync(filepath);
        app.notExpect('stdout', new RegExp(`reload worker because ${filepath}`));
        done();
      }, 1000);
    });
  });

  describe('EGG_DEBUG = true', function() {
    let app;
    before(done => {
      mm.env('local');
      mm(process.env, 'EGG_DEBUG', 'true');
      app = mm.cluster({
        baseDir: 'development',
      });
      setTimeout(done, 5000);
    });
    after(mm.restore);
    after(() => app.close());

    it('should reload', function(done) {
      const filepath = path.join(__dirname, 'fixtures/development/app/service/a.js');
      fs.writeFileSync(filepath, '');
      setTimeout(function() {
        fs.unlinkSync(filepath);
        app.notExpect('stdout', new RegExp(`reload worker because ${filepath} change`));
        done();
      }, 1000);
    });
  });
});
