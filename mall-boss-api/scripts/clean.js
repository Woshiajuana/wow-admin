'use strict';

const shell = require('gulp-shell');
module.exports = shell.task([
  'rm -rf dist',
]);
