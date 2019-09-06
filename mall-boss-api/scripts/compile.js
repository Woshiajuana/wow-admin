'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

module.exports = () => {
  return gulp.src([
    'pwd',
    'echo "======>>>>"',
    '!./build/**/*',
    '!./scripts/**/*',
    '!./dist/**/*',
    '!./loggs/**/*',
    '!./node_modules/**/*',
    '!./run/**/*',
    '!./test/**/*',
    '!./docs/**/*',
    './**/*.js',
  ])
    // .pipe(babel({ presets: [ 'minify' ] })) //*构建时结构...有问题
    .pipe(gulp.dest('./dist'));
};

