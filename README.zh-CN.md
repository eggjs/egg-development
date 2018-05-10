# egg-development

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-development.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-development
[travis-image]: https://img.shields.io/travis/eggjs/egg-development.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-development
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-development.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-development?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-development.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-development
[snyk-image]: https://snyk.io/test/npm/egg-development/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-development
[download-image]: https://img.shields.io/npm/dm/egg-development.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-development

这是针对 egg 本地开发环境特定功能的插件，此插件默认在开发环境启用，其他环境关闭。

## 开启插件

```js
// config/plugin.js
exports.development = {
  enable: true,
  package: 'egg-development',
};
```

## 配置

请到 [config/config.default.js](https://github.com/eggjs/egg-development/blob/master/config/config.default.js) 查看详细配置项说明。

## 功能

- 开发环境的请求日志在 STDOUT 输出，并统计各个关键部位耗时并输出；
- 监视应用文件变动，实现 Reload 重新加载新的代码；

### 关于 Reload

默认以下目录（包括下级的子目录）将会被监视文件变动，触发 egg 开发环境服务器重新载入：

- $project/app
- $project/config
- $project/mocks
- $project/mocks_proxy

默认以下目录（包括下级的子目录）将会被过滤：

- $project/app/view
- $project/app/assets

### Loader Trace

你可以访问 `http://127.0.0.1:7001/__loader_trace__` 查看 Loader 的速度。

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](https://github.com/eggjs/egg-development/blob/master/LICENSE)
