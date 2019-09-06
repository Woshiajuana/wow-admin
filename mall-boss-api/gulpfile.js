'use strict';

[
  'default',
  'build',
  'clean',
  'compile',
  'prepare',
  'dependencies',
].forEach(name => {
  require('gulp').task(name, require(`./scripts/${name}`));
});
