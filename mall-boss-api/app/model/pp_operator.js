'use strict';

const path = require('path');

module.exports = app => {
  const Sequelize = app.Sequelize;
  return app.model.define(path.basename(__filename, path.extname(__filename)), {

    operator_no: { type: Sequelize.STRING },
    belong_to_org: { type: Sequelize.STRING },
    own_to_org: { type: Sequelize.STRING },
    role_no: { type: Sequelize.STRING },
    app_no: { type: Sequelize.STRING },
    user_name: { type: Sequelize.STRING },
    mobile: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    nick_name: { type: Sequelize.STRING },
    otp_key: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    register_ip: { type: Sequelize.STRING },
    last_login_ip: { type: Sequelize.STRING },

    login_max_err_times: { type: Sequelize.INTEGER },
    login_err_times: { type: Sequelize.INTEGER },
    lock_status: { type: Sequelize.ENUM, values: [ 'normal', 'lock' ] },

    creator_name: { type: Sequelize.STRING },
    created_at: { type: Sequelize.STRING },
    updated_at: { type: Sequelize.STRING },
    status: { type: Sequelize.ENUM, values: [ 'normal', 'disabled' ] },
  });
};
