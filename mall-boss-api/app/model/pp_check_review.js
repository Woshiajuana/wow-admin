'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {

    belong_to_org: { type: Sequelize.STRING },
    applicator_name: { type: Sequelize.STRING },

    checker_name: { type: Sequelize.STRING },
    check_time: { type: Sequelize.STRING },
    check_remark: { type: Sequelize.STRING },
    body: { type: Sequelize.STRING },

    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
  });
};
