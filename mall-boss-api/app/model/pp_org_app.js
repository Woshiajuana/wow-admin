'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {
    app_no: { type: Sequelize.STRING },
    org_no: { type: Sequelize.STRING },
    belong_to_org: { type: Sequelize.STRING },
    category: { type: Sequelize.STRING },
    app_code: { type: Sequelize.STRING },
    type: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    logo: { type: Sequelize.STRING },
    desc: { type: Sequelize.STRING },
    theme: { type: Sequelize.STRING },
    icp: { type: Sequelize.STRING },
    app_info: { type: Sequelize.STRING },

    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
  });
};
