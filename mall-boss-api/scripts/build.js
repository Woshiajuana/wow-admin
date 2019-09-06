'use strict';

const runSequence = require('run-sequence');

module.exports = cb => {
  runSequence(
    'prepare',
    'compile',
    'dependencies',
    cb);
};
