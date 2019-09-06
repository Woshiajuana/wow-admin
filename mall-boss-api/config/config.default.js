'use strict';

const exportHeader = require('./export/exportHeader');

module.exports = appInfo => {

  const config = {
    appName: appInfo.pkg.name,
    keys: 'wSYxITdFCo2Q2IweXx2P2LP6RMyTXOeJ',
    middleware: [],
  };
  config.exportHeader = exportHeader;

  config.fileRootDir = '/opt/files/mall-boss';

  // use for cookie sign key, should change to your own and keep security

  config.cluster = {
    listen: {
      port: 17011,
    },
  };

  config.cors = {
    origin: '*', // 允许跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.bodyParser = {
    formLimit: '500kb',
  };

  config.public = {
  };

  config.security = {
    csp: {
      enable: true,
      policy: {
        'default-src': "'self' * 'unsafe-eval' 'unsafe-inline' data:;",
        'base-uri': '*',
        'frame-src': '*',
      },
    },
  };

  config.userAgent = {
    match: '/api',

    blacklist: [
      /spider/i,
    ],
  };

  config.httpclient = {
    request: {
      // 超时时间改为30s
      timeout: '30s',
    },
  };

  // 上传文件格式列表
  config.multipart = {
    mode: 'file',
    fileExtensions: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.xls',
      '.xlsx',
      '.txt',
      '.7z',
      '.rar',
      '.zip',

      '.apk',
      '.js',
      '.crx',

      /* 公钥私钥文件格式*/
      '.cer',
      '.crt',
      '.key',
      '.csr',
      '.der',
      '.store',
      '.pfx',
      '.pem',
      '.p12',
      '.properties',
      '.json',
      '.crl',
      '.jks',
      '.csv',
    ],
  };

  config.redis = {
    client: {
      host: '47.95.202.71',
      port: '6379',
      password: 'zbDHVaWOgMdV4rPQ3wETRYfRFjlEos83',
      db: 0,
      keyPrefix: 'mall-boss-api:',
    },
    agent: false,
  };

  config.SmsService = {
    apiName: '短信服务smsService',
    apiUrl: 'http://47.100.28.194:17000',
  };

  config.ScoreMallService = {
    apiName: '积分商城服务scoreMallService',
    apiUrl: 'http://47.100.28.194:17012',
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'score_mall',
    host: '47.103.3.222',
    port: '3306',
    username: 'dbagroup',
    password: 'k5mLTK2tcv4kbgKe1234',
    timezone: '+08:00',
    // https://stackoverflow.com/questions/47367893/sequelize-reads-datetime-in-utc-only
    // https://github.com/sequelize/sequelize/issues/854
    dialectOptions: {
      // useUTC: false, // for reading from database
      // dateStrings: true,
      typeCast(field, next) { // for reading from database
        // if (field.type === 'TIMESTAMP') {
        //   return field.string();
        // }

        if (field.type === 'DATETIME') {
          return field.string();
        }

        return next();
      },
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
    // 这里sequelize是有bug的读取是0时区写入是timezone时区
    // typeCast(field, next) {
    //   console.log('--------------');
    //   if (field.type === 'DATETIME') {
    //     return new Date(field.string() + 'Z'); // can be 'Z' for UTC or an offset in the form '+HH:MM' or '-HH:MM'
    //   }
    //   return next();
    // },

    pool: {
      max: 30,
      min: 0,
      acquire: 60000,
      idle: 30000,
    },

    define: {
      // don't use camelcase for automatically added attributes but underscore style
      underscored: true,
      // disable the modification of table names; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      freezeTableName: true,
      charset: 'utf8',
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false,
      // soft delete
      paranoid: false,
      timezone: '+08:00',
      dialectOptions: {
        // useUTC: false, // for reading from database
        // dateStrings: true,
        typeCast(field, next) { // for reading from database
          // if (field.type === 'TIMESTAMP') {
          //   return field.string();
          // }

          if (field.type === 'DATETIME') {
            return field.string();
          }

          return next();
        },
        supportBigNumbers: true,
        bigNumberStrings: true,
      },

    },
  };

  config.limitRequest = {
    ipEnable: false, // 关闭适用于c端，h5端更换网络引起的错误判断
    errorMsg: '频繁请求，请稍后尝试',
  };

  config.limitRequestApis = {
    // 请求频率限制
    smsCaptcha: '60s',
  };

  // Boss登陆有效时间
  config.accessToken = {
    maxAge: '24h',
    checkClientMac: false,
  };

  // 同一个账号最大允许登录人数
  config.maxUserLoginCount = 5;

  config.normalResponse = {
    // errCode, respErrorDetails, respMessage
    formatFailRespHook: result => {
      if (result.respMessage === '服务异常' ||
        result.respMessage === '系统异常' ||
        result.errCode === 'F9999') {
        result.respMessage = '系统繁忙，请稍后再试';
      }

      return result;
    },
  };

  config.ImageCaptchaService = {
    loginNeedCaptcha: false,
    captchaTokenMaxAge: '2m',
    responseCaptchaText: appInfo.env === 'local',
  };

  config.oss = {
    client: {
      accessKeyId: 'LTAIYt7l1QCxDuv8',
      accessKeySecret: 'KU3ZfJIy83OPNncw0B3UVyvNW4jXOH',
      bucket: 'scoremall',
      endpoint: 'oss-cn-beijing.aliyuncs.com',
      timeout: '60s',
    },
  };

  return config;
};
