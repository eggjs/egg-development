'use strict';

const path = require('path');

/**
 * ignore assets http request log at local development mode
 */
const excludeRequestLogExts = [ '.js', '.css', '.png', '.svg', '.gif', '.jpg', '.ico' ];
const assetsPrefix = /^\/(assets\/|public\/|__koa_mock_scene_toolbox)/;

module.exports = function() {
  return function* devLog(next) {
    yield* next;
    if (assetsPrefix.test(this.path)) {
      return;
    }

    const requestExt = path.extname(this.path);
    if (excludeRequestLogExts.indexOf(requestExt) >= 0) {
      return;
    }
    this.runtime.rt = Date.now() - this.starttime;

    const runtimes = [];
    for (const key in this.runtime) {
      if (this.runtime[key] && this.runtime[key] > 0) {
        runtimes.push(`${key}: ${this.runtime[key]}ms`);
      }
    }
    this.logger.info(`status ${this.status} (${runtimes.join(', ')})`);
  };
};
