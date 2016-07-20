/**!
 * 本地调试文件监听
 *
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   贯高 <guangao@alipay.com>
 */

'use strict';

const path = require('path');

module.exports = function(agent) {
  const logger = agent.logger;
  const baseDir = agent.config.baseDir;
  const config = agent.config.development;

  const watchDirs = [
    'app',
    'config',
    'mocks',
    'mocks_proxy',
  ].concat(config.watchDirs).map(dir => path.join(baseDir, dir));

  const ignoreReloadFileDirs = [
    'app/views',
    'app/assets',
    'app/public',
  ].concat(config.ignoreDirs).map(dir => path.join(baseDir, dir));

  // 开发模式下监听 App 的几个主要的代码目录
  // 监听目录变化，重启 worker 进程
  agent.watcher.watch(watchDirs, reloadWorker);

  /*
    文件改变，发送重启 worker 的动作
    Worker reload 流程

    [AgentWorker] - on file change
      |-> emit reload-worker

    [Master] - receive reload-worker event
      |-> TODO: Mark worker will die
      |-> Fork new worker
        |-> kill old worker
  */
  function reloadWorker(info) {
    // egg-bin debug 不 reload
    if (process.env.EGG_DEBUG) {
      return;
    }

    // 监控是否服务端 js 变化了，是的话重启 worker
    // 过滤静态文件变化
    if (isAssetsDir(info.path) || !info.isFile) {
      return;
    }

    logger.warn(`[agent:development] reload worker because ${info.path} ${info.event}`);
    // egg@1.x 的消息模型
    agent.messenger.broadcast('reload-worker');
    // egg@2.x 的消息模型
    process.send({
      to: 'master',
      action: 'reload-worker',
    });
  }

  // 检测是否是排除 reload 的文件路径
  function isAssetsDir(path) {
    for (const ignorePath of ignoreReloadFileDirs) {
      if (path.startsWith(ignorePath)) {
        return true;
      }
    }
    return false;
  }
};
