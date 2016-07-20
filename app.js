/**!
 * develoment 插件
 *
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   贯高 <guangao@alipay.com>
 */

'use strict';

module.exports = function(app) {
  app.config.coreMiddleware.unshift('development');

  // 本地开发环境不需要等待，文件加载完成就启动，使用 nextTick 为了加载其他文件
  process.nextTick(() => app.ready(true));
};
