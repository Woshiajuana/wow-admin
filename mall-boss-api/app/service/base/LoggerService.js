'use strict';

const Service = require('egg').Service;

class LoggerService extends Service {

  async log(typeInfo = {}, data) {
    const { ctx, app } = this;
    const { logger } = app;
    let { accessData, authData } = ctx;
    const { PpOperationLog } = ctx.model;
    const pathArr = ctx.path.split('/');
    const lastClass = pathArr.length - 1;
    const reqData = Object.assign({}, ctx.query, ctx.request.body);
    const resBody = Object.prototype.toString.call(ctx.response.body) === '[object Object]' ? ctx.response.body : {};
    const resData = Object.prototype.toString.call(resBody.data) === '[object Object]' ? resBody.data : {};
    const levelData = {
      0: 'normal', 1: 'middle', 2: 'high', 3: 'danger', NaN: 'normal',
      normal: 'normal', middle: 'middle', high: 'high', danger: 'danger',
    };
    typeInfo.level = Number(typeInfo.level) < 0 ? 0 : typeInfo.level;
    const level = levelData[typeInfo.level] ? typeInfo.level : Number(typeInfo.level) > 3 ? 3 : Number(typeInfo.level);

    accessData = accessData || '';

    if (!accessData && !authData) {
      logger.info('记录日志失败,未授权或者无符合数据！');
      logger.info('Request params: ' + JSON.stringify(Object.assign({}, ctx.query, ctx.request.body)));
      logger.info('=====================');
      return;
    }
    const { operator = {}, app: acApp = {} } = accessData || {};
    const app_no = acApp && acApp.app_no ? acApp.app_no : authData.orgAppNo || '';
    const operator_name = operator.nick_name ? operator.nick_name || operator.user_name : authData.loginName || '';
    const session_token = accessData ? accessData.accessToken : 'auth:' + authData.authToken;
    const action_group = pathArr[lastClass - 1];
    const action = pathArr[lastClass];

    const actionDefaultData = {
      app_no,
      operator_name: operator_name || '',
      operator_ip: ctx.ip,
      session_token,
      action_group,
      action_group_name: typeInfo.group || action_group,
      action,
      action_name: typeInfo.name || action,
      action_request_params: reqData ? JSON.stringify(reqData) : '',
      action_result_params: resData ? JSON.stringify(resData) : '',
      action_result_msg: resBody ? JSON.stringify(Object.assign({}, resBody, { data: '' })) : '',
      security_level: levelData[level] || '',
    };
    const actionData = Object.assign({}, actionDefaultData, data);
    await PpOperationLog.create(actionData);
    logger.info('数据库——记录日志成功.');
    logger.info('=====================');
    console.log(JSON.stringify(actionData, null, '\t'));
  }

  // 支持分页处理
  async list(appNo, offset = 0, limit = 20, startTime, endTime, operatorName, operatorIp, sessionToken, actionGroupName, actionName, scuityLevel) {
    const { ctx, logger, app } = this;
    const { model } = ctx;
    const { PpOperationLog } = model;
    const { Op } = app.Sequelize;

    if (!appNo) {
      ctx.throwError('appNo 不能为空');
      return;
    }

    logger.info(`list appNo: ${appNo} 开始`);

    const whereCondition = {
      app_no: appNo,
      created_at: {
        [Op.between]: [ startTime, endTime ],
      },
    };

    if (operatorName) {
      whereCondition.operator_name = operatorName;
    }
    if (operatorIp) {
      whereCondition.operator_ip = operatorIp;
    }
    if (sessionToken) {
      whereCondition.session_token = sessionToken;
    }
    if (actionGroupName) {
      whereCondition.action_group_name = actionGroupName;
    }
    if (actionName) {
      whereCondition.action_name = actionName;
    }
    if (scuityLevel) {
      whereCondition.security_level = scuityLevel;
    }

    const logList = await PpOperationLog.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [[ 'created_at', 'desc' ]],
    });
    // logList.count = result.count;
    // logList.list = result.rows;

    logger.info(`list appNo: ${appNo}  结束`);

    return {
      count: logList.count,
      list: logList.rows,
    };
  }
}

module.exports = LoggerService;
