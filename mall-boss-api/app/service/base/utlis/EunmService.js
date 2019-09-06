'use strict';
const Service = require('egg').Service;

module.exports = class EunmService extends Service {

  async enum(originList, enumKey = {}, enumType = 'array') {
    const { ctx, logger } = this;

    if (!originList) {
      logger.info('Enum origin Data 为空');
      return;
    }

    // 返回是否对象格式映射
    const isObject = enumType === 'object';

    // 定义枚举取哪个key
    const enumKeyInfo = {
      name: 'name',
      code: 'code',
    };

    const currentEnum = Object.assign({}, enumKeyInfo, enumKey); // 合并默认enumKeyInfo
    const targetNameKey = currentEnum.name;
    const targetCodeKey = currentEnum.code;

    const formatObjerct = data => {
      const resultObject = {};
      data.forEach(item => {
        resultObject[item[targetNameKey]] = item[targetCodeKey];
      });
      return resultObject;
    };

    const formatArray = data => data.map(item => ({
      label: item[targetNameKey],
      value: item[targetCodeKey],
    }));

    return isObject ? formatObjerct(originList) : formatArray(originList);
  }

};

