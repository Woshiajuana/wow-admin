'use strict';

// 重要！！！！
// 这里填写db api log redis， mq， file 等偏向基础服务的配置
//
// 这里的key 可以是使用 'a.b.c 的语法'
// value: null, undefined 表达 需要定义的任何职
// value: string, boolean 表达 严格相等
// value: Array 表达 必须是其中一种
// value: function 表达自定义

module.exports = {
  redis: null,
  sequelize: null,
  proxy: null,

  'logger.dir': val => {
    if (!val) return false;
    return val.startsWith('/opt/logs');
  },

  fileRootDir: val => {
    if (!val) return false;
    return val.startsWith('/opt/files');
  },
};
