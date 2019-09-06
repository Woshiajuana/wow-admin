'use strict';

const crypto = require('crypto');
const uuid = require('uuid');
const pify = require('pify');
const ms = require('ms');

const helper = {

  // 驼峰式转换 string/object/array
  camelCased(data, config = {}) {
    const { type = 'hump', symbol = '_', deep = false } = config;
    const whichType = data => {
      const include = [ '[object String]', '[object Object]', '[object Array]' ];
      const type = Object.prototype.toString.call(data);
      return include.indexOf(type) !== -1 ? type : 'other';
    };
    const regStr = '/' + symbol + '([a-z])/g';
    const regRules = {
      hump: str => str.replace(eval(regStr), (all, letter) => letter.toUpperCase()),
      line: str => str.replace(/\B([A-Z])/g, symbol + '$1').toLowerCase(),
    };
    const transform = {
      '[object String]': data => {
        if (data.includes(symbol)) return data;
        return regRules[type](data);
      },
      '[object Object]': data => {
        if (whichType(data) !== '[object Object]') return data;
        const newObj = {};
        Object.keys(data).forEach(key => {
          newObj[regRules[type](key)] = deep ? transform[whichType(data[key])](data[key]) : data[key];
        });
        return newObj;
      },
      '[object Array]': data => {
        const newArr = [];
        data.forEach(item => {
          const newItem = typeof item === 'string' ? item : transform[deep ? whichType(item) : '[object Object]'](item);
          newArr.push(newItem);
        });
        return newArr;
      },
      other: data => data,
    };

    return transform[whichType(data)](data);
  },
  
  // 下划线转驼峰 string/object/array
  toHump(data, deep = false, symbol = '_') {
    const newData = data && typeof data !== 'string' && data[0] ? data.map(item => {
      return item.dataValues ? item.toJSON() : item;
    }) : data;
    return helper.camelCased(newData, { deep, symbol, type: 'hump' });
  },

  // 驼峰转下划线 string/object/array
  toLine(data, deep = false, symbol = '_') {
    return helper.camelCased(data, { deep, symbol, type: 'line' });
  },
  toExportList({ count = '', list = [], title = '', header = [], footer = '' }) {
    return {
      summary: {
        title,
        attrMap: {
          totalCount: {
            label: '总条数',
            value: count,
          },
        },
      },
      header,
      footer,
      title,
      content: list,
    };
  },
  hasTake(target, callback) {
    const judgeVal = val => {
      if (val !== undefined) {
        return typeof callback === 'function' ? callback(val) : val;
      }
    };
    if (Object.prototype.toString.call(target) === '[object Array]') {
      for (const item of target) {
        const fixValue = judgeVal(item);
        if (fixValue !== undefined) return fixValue;
      }
    } else {
      const fixValue = judgeVal(target);
      if (fixValue !== undefined) return fixValue;
    }
  },
  hashCode(str) {
    let h = 0;
    let len = str.length;
    let t = 2147483648;
    for (let i = 0; i < len; i++) {
      h = 31 * h + str.charCodeAt(i);
      if (h > 2147483647) h %= t; // java int溢出则取模
    }
    /* var t = -2147483648 * 2;
    while (h > 2147483647) {
        h += t
    }*/
    return h;
  },
  // 补0
  prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  },
  // uuid转数字（长度，是否从尾数取）
  uuidCode(length) {
    const uuidHash = crypto.createHash('md5').update(uuid.v1()).digest('hex');
    const code = String(helper.hashCode(uuidHash));
    if (!length) return code;
    let resultCode = '';
    if (length < 0) { // 尾数取
      resultCode = code.slice(length);
    } else {
      resultCode = code.slice(0, length);
    }
    const absLength = Math.abs(length); // 长度超过结果code，不足补0
    if (absLength > resultCode.length) {
      resultCode = helper.prefixInteger(resultCode, absLength);
    }
    return resultCode;
  },
  // filter undefined and target field
  filterField(object, filterField = []) {
    const targetObject = {};
    Object.keys(object).filter(key => object[key] && !filterField.includes(key)).forEach(key => {
      targetObject[key] = object[key];
    });
    return targetObject;
  },
};

module.exports = helper;
