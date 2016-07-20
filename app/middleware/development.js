/**!
 * development 环境辅助中间件，如开发下需要的静态文件中间件等
 *
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   苏千 <suqian.yf@alipay.com> (http://fengmk2.com)
 *   贯高 <guangao@alipay.com>
 */

'use strict';

/**
 * Module dependencies.
 */

const path = require('path');

/**
 * 写开发环境的请求日志
 * 将会忽略 /assets 里面的东西，忽略 .js, .css ... 等资源文件的请求
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
