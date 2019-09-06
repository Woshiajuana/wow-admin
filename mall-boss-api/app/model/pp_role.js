'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {

    role_no: { type: Sequelize.STRING },
    parent: { type: Sequelize.STRING },
    app_no: { type: Sequelize.STRING },
    org_no: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    desc: { type: Sequelize.STRING },
    level: { type: Sequelize.INTEGER },

    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
    creator_name: { type: Sequelize.STRING },
    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
  });
};
