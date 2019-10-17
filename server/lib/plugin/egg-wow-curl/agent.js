'use strict';

const fn = require('./lib/curl');

module.exports = agent => {
    if (agent.config.validate.agent) fn(agent);
};
