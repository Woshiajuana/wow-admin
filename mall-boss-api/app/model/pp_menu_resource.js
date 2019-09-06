'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {

    resource_code: { type: Sequelize.STRING },
    type: { type: Sequelize.ENUM, values: [ 'menu', 'func' ] },
    parent: { type: Sequelize.STRING },
    action_type: { type: Sequelize.STRING },
    action_params: { type: Sequelize.STRING },
    resource_url: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    desc: { type: Sequelize.STRING },
    priority: { type: Sequelize.INTEGER },
    icon: { type: Sequelize.STRING },

    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
    default_is_selected: { type: Sequelize.ENUM, values: [ 'Y', 'N' ] },
  });
};
