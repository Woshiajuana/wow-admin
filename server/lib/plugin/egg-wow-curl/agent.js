'use strict';

const fn = require('./lib/curl');

module.exports = app => {
    if (app.config.validate.app) fn(app);
};

