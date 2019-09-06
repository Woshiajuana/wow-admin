'use strict';

const shell = require('gulp-shell');

module.exports = shell.task(
  [
    'mkdir -p ./dist/app',
    'mkdir -p ./dist/config',
    'cp ./server-start ./dist',
    'cp ./server-stop ./dist',
    'cp ./package.json ./dist',
    'cp ./yarn.lock ./dist',
    'cp ./app.yml ./dist',
    'cp -r ./app/public ./dist/app',
    'cp -r ./config/* ./dist/config',
  ]
);
