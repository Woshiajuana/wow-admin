'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {

    app_no: { type: Sequelize.STRING },
    operator_name: { type: Sequelize.STRING },
    operator_ip: { type: Sequelize.STRING },
    session_token: { type: Sequelize.STRING },

    action_group: { type: Sequelize.STRING },
    action_group_name: { type: Sequelize.STRING },

    action: { type: Sequelize.STRING },
    action_name: { type: Sequelize.STRING },


    action_request_params: { type: Sequelize.STRING },
    action_result_params: { type: Sequelize.STRING },

    action_result_msg: { type: Sequelize.STRING },

    security_level: { type: Sequelize.ENUM, values: [ 'normal', 'middle', 'high', 'danger' ] },

    created_at: { type: Sequelize.STRING },
  });
};
