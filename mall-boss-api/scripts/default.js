'use strict';

const runSequence = require('run-sequence');

module.exports = cb => {
  runSequence(
    'clean',
    'build',
    cb);
};
