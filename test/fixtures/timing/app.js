'use strict';

const fs = require('fs');
const path = require('path');

module.exports = app => {
  app.checkFile = {
    timing: fs.existsSync(path.join(__dirname, 'run/agent_timing_11111.json')),
    config: fs.existsSync(path.join(__dirname, 'run/application_config.json')),
  };
};
