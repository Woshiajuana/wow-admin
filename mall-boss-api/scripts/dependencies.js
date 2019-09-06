'use strict';

const shell = require('gulp-shell');
module.exports = shell.task(
  'cd ./dist && yarn install --production=true && cd -'
);

