'use strict';

/**
 * 本地开发环境的配置
 *
 * @member Config#development
 * @property {Function} staticMiddleware - 开启静态文件 serve 服务，一般和构建工具配套使用。
 *    在开发时通过 serve 服务将请求映射到源文件。只在本地开发环境开启时，建议使用
 *    [chair-spm](http://gitlab.alipay-inc.com/chair/chair-spm)，可以看下面的例子：
 *
 * 注：`staticMiddleware` 需要满足 koa 中间件的写法。
 *
 * @example
 * ```js
 * exports.development = {
 *   staticMiddleware: require('chair-spm').middleware,
 * };
 * ```
 */
exports.development = {
  staticMiddleware: null,
  watchDirs: [],
  ignoreDirs: [],
};
