'use strict';

const context = {
  /**
   * Parameter && egg-validator Plus
   * @param {*} rules
   * @param {*} data
   */

  validate(rulesConfig, data, config = {}) {
    if (Object.prototype.toString.call(rulesConfig) !== '[object Object]' &&
        Object.prototype.toString.call(rulesConfig) !== '[object Array]') {
      throw new Error('rules is an Object or an Array');
    }

    // add any rule
    this.app.validator.addRule('any', (rule, value) => {
      const allowEmptyString = rule.hasOwnProperty('allowEmpty') ? rule.allowEmpty : rule.empty;
      if (value === null || value === undefined || (!allowEmptyString && value === '')) {
        return 'required';
      }
    });
    // fix object rule
    this.app.validator.addRule('object', (rule, value) => {
      if (Object.prototype.toString.call(value) !== '[object Object]') {
        return 'should be an object';
      }

      if (rule.rule) {
        return this.validate(rule.rule, value);
      }
    });

    let rules = {};

    if (Object.prototype.toString.call(rulesConfig) === '[object Array]') {
      rulesConfig.forEach(item => {
        Object.assign(rules, item);
      });
    }
    if (Object.prototype.toString.call(rulesConfig) === '[object Object]') {
      rules = rulesConfig;
    }

    const rulesObj = {};

    Object.keys(rules).forEach(key => {
      if (rules[key] === true) {
        rulesObj[key] = { type: 'any', required: true };
      } else
      if (rules[key] === false) {
        rulesObj[key] = { type: 'any', required: false };
      } else
      if (typeof rules[key] === 'string') {
        rulesObj[key] = { type: rules[key] };
      } else {
        rulesObj[key] = rules[key];
      }
    });

    data = data || this.request.body;
    const errors = this.app.validator.validate(rulesObj, data);
    if (errors) {
      const errorTipMessage = errors.length === 1 ? rulesObj[errors[0].field].message : '';
      const errCode = errors.length === 1 ? rulesObj[errors[0].field].errCode : '';

      const errorMessageObj = {};
      const requiredField = [];
      const errorField = {};
      errors.forEach(item => {
        const field = item.field;
        const message = item.message;
        if (message === 'required') {
          requiredField.push(field);
        } else {
          let fixMessage = '';
          // type
          if (message.includes('should be a ')) {
            fixMessage = message.replace(/should be a /, '');
          } else
          // type
          if (message.includes('should be an ')) {
            fixMessage = message.replace(/should be an /, '');
          } else
          // string not empty
          if (message.includes('should not be empty')) {
            fixMessage = message.replace(/should not be empty/, 'no empty string');
          } else
          // enum
          if (message.includes('should be one of ')) {
            fixMessage = message.replace(/should be one of /, '').replace(/, /g, '/');
          } else
          // max
          if (message.includes('should smaller than ')) {
            fixMessage = message.replace(/should smaller than /, '<');
          } else
          // max
          if (message.includes('should bigger than ')) {
            fixMessage = message.replace(/should bigger than /, '>');
          } else
          // date
          if (message.includes('should match /^\\d{4}\\-\\d{2}\\-\\d{2}$/')) {
            fixMessage = 'yyyy-MM-dd';
          } else
          if (message.includes('should match /^\\d{4}\\-\\d{2}\\-\\d{2} \\d{2}:\\d{2}:\\d{2}$/')) {
            fixMessage = 'yyyy-MM-dd HH:mm:ss';
          }
          errorField[field] = fixMessage;
        }
      });
      if (requiredField[0]) {
        errorMessageObj.required = requiredField.join('、');
      }
      Object.assign(errorMessageObj, errorField);
      const formatErrorMessage = JSON.stringify(errorMessageObj).replace(/\"/g, '').replace(/{/g, '').replace(/}/g, '').replace(/,/g, ' | ');
      const err = new Error();
      err.errCode = errCode || 'F400';
      if (err.errCode === 'F400') {
        err.message = '参数错误';
      }
      if (errorTipMessage) {
        err.message = errorTipMessage;
      }
      err.normalResponse = true;
      err.respErrorDetails = formatErrorMessage;

      this.logger.info(`验证失败 - Validate fail, error message >>>> 【${formatErrorMessage}】`);

      throw err;
    }
  },
};

module.exports = context;
