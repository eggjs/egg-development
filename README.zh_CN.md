# egg-development

[![TNPM version][tnpm-image]][tnpm-url]
[![TNPM downloads][tnpm-downloads-image]][tnpm-url]
[![build status][ci-image]][ci-url]
[![line coverage][line-coverage-image]][ci-url]
[![branch coverage][branch-coverage-image]][ci-url]

[tnpm-image]: http://web.npm.alibaba-inc.com/badge/v/@ali/egg-development.svg?style=flat-square
[tnpm-url]: http://web.npm.alibaba-inc.com/package/@ali/egg-development
[tnpm-downloads-image]: http://web.npm.alibaba-inc.com/badge/d/egg-development.svg?style=flat-square
[ci-image]: http://cise.alibaba-inc.com/task/160079/status.svg
[ci-url]: http://cise.alibaba-inc.com/task/160079
[line-coverage-image]: http://cise.alibaba-inc.com/task/160079/ut_line_coverage.svg
[branch-coverage-image]: http://cise.alibaba-inc.com/task/160079/ut_branch_coverage.svg

这是针对 egg 本地开发环境特定功能的插件，此插件默认在开发环境启用，其他环境关闭。

### 功能

- 开发环境的请求日志在 STDOUT 输出，并统计各个关键部位耗时并输出；
- 监视应用文件变动，实现 Reload 重新加载新的代码；

### 配置

```js
// config/config.local.js
exports.development = {
  watchDirs: [], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
  ignoreDirs: [], // 指定过滤的目录（包括子目录）
  fastReady: true, // 启动后马上 ready
};
```

### 关于 Reload

默认以下目录（包括下级的子目录）将会被监视文件变动，触发 Egg 开发环境服务器重新载入：

- $project/app
- $project/config
- $project/mocks
- $project/mocks_proxy

默认以下目录（包括下级的子目录）将会被过滤：

- $project/app/views
- $project/app/assets
