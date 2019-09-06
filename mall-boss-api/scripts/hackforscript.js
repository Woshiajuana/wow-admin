'use strict';

const shell = require('gulp-shell');
module.exports = shell.task(
  'cp ./scripts/master.js ./dist/node_modules/egg-cluster/lib'
);

