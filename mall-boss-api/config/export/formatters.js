'use strict';

const moment = require('moment');


const formatters = {
  /**
   * 格式化日期
   */

  formatDate(time, formatStr = 'YYYY-MM-DD HH:mm:ss') {
    const defaultFormat = formatStr || 'YYYY-MM-DD HH:mm:ss';
    return moment().format(time || new Date(), defaultFormat);
  },

  /**
   * 格式化金额 转换为千位符
   */

  formatNum(num) {
    if (num === null || num === undefined) {
      return '';
    }
    return String(num).replace(/,/g, '')
      .replace(/(\d+\.?\d+)|\d+/g, n => Number(n).toFixed(2))
      .replace(/\d+/g, n => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ','));
  },

  /**
   * 格式化金额 转换为元
   */

  formatMoney(amount, unit = 'YUAN', fixedDigit = 2) {
    let result = null;
    if (unit.toUpperCase() === 'YUAN') {
      result = Number(amount / 100);
    }
    if (unit.toUpperCase() === 'FEN') {
      result = Number(amount * 100);
    }
    return result.toFixed(fixedDigit);
  },

  /**
   * 手机号转星号
   */

  enMobileStr(mobile) {
    if (mobile) {
      return mobile.substr(0, 3) + '****' + mobile.substr(7, 4);
    }
    return '';
  },

};
module.exports = formatters;
