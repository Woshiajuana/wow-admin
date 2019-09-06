'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {
    app_no: { type: Sequelize.STRING },
    category: { type: Sequelize.STRING },
    key: { type: Sequelize.STRING },
    value: { type: Sequelize.STRING },
    desc: { type: Sequelize.STRING },

    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
  });
};
