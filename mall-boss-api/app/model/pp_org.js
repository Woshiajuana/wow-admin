'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {

    org_no: { type: Sequelize.STRING },
    belong_to_org: { type: Sequelize.STRING },
    own_to_org: { type: Sequelize.STRING },

    name: { type: Sequelize.STRING },
    nick_name: { type: Sequelize.STRING },
    desc: { type: Sequelize.STRING },
    mobile: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    website: { type: Sequelize.STRING },

    type: { type: Sequelize.ENUM, values: [ 'root', 'platform', 'agent' ] },
    level: { type: Sequelize.INTEGER },
    max_level: { type: Sequelize.INTEGER },

    creator_create_type: { type: Sequelize.STRING },
    creator_name: { type: Sequelize.STRING },

    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
  });
};
