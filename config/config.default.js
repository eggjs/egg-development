'use strict';

/**
 * @member Config#development
 * @property {Array} watchDirs - dirs needed watch, when files under these change, application will reload, use relative path
 * @property {Array} ignoreDirs - dirs don't need watch, including subdirectories, use relative path
 * @property {Boolean} fastReady - don't wait all plugins ready, default is true.
 * @property {Boolean} reloadOnDebug - whether reload on debug, default is true.
 * @see https://github.com/eggjs/egg-development-proxyworker to keep debug port when restart
 */
exports.development = {
  watchDirs: [],
  ignoreDirs: [],
  fastReady: true,
  reloadOnDebug: true,
};
