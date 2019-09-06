'use strict';

const Controller = require('egg').Controller;
const QRCode = require('qrcode');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const NodeRSA = require('node-rsa');

module.exports = class ToolController extends Controller {

  static route(app, middlewares, controller) {
    const { post } = app.router;

    post('/api/console/tool/base64', controller.base64);
    post('/api/console/tool/md5', controller.md5);
    post('/api/console/tool/aes-encrypt', controller.aesEncrypt);
    post('/api/console/tool/aes-decrypt', controller.aesDecrypt);

    post('/api/console/tool/rsa-encrypt', controller.rsaEncrypt);
    post('/api/console/tool/rsa-decrypt', controller.rsaDecrypt);
    post('/api/console/tool/rsa-pairs', controller.rsaPairs);

    post('/api/console/tool/run', middlewares.otpToken(), controller.run);
    post('/api/console/tool/otp-token', middlewares.otpToken(), controller.otpToken);


  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/base64 base64工具
   *
   * @apiDescription 输入原始字符串返回base64之后的字符串
   *
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} value  原始字符串
   *
   *
   * @apiSampleRequest /api/console/tool/base64
   *
   */
  async base64() {
    this.ctx.body = new Buffer(this.ctx.request.body.value || '').toString('base64');
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/aes-encrypt aesEncrypt工具
   *
   * @apiDescription 输入原始字符串返回加密的字符串
   *
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} message  原始字符串
   * @apiParam {String} secret  密钥字符串
   *
   *
   * @apiSampleRequest /api/console/tool/aes-encrypt
   *
   */
  async aesEncrypt() {

    const { ctx } = this;
    const { helper } = ctx;
    const { message, secret } = ctx.request.body;

    const encryptMessage = helper.aesEncrypt(message, secret);
    this.ctx.body = encryptMessage;
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/aes-decrypt aesDecrypt工具
   *
   * @apiDescription 输入加密字符串返回解密字符串
   *
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} message  加密字符串
   * @apiParam {String} secret  密钥字符串
   *
   *
   * @apiSampleRequest /api/console/tool/aes-decrypt
   *
   */
  async aesDecrypt() {

    const { ctx } = this;
    const { helper } = ctx;
    const { message, secret } = ctx.request.body;

    const encryptMessage = helper.aesDecrypt(message, secret);
    ctx.body = encryptMessage;
  }


  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/rsa-encrypt rsaEncrypt工具
   *
   * @apiDescription 输入原始字符串返回加密的字符串 encoding hex, utf8, base64
   *
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} message  原始字符串
   * @apiParam {String} secret  密钥字符串
   * @apiParam {String="pkcs1-private","pkcs8-public","pkcs8-private", "pkcs1-private-der", "pkcs8-public-der"} format  密钥格式
   * @apiParam {String="hex","utf8","base64"} encoding 编码
   *
   * @apiSampleRequest /api/console/tool/rsa-encrypt
   *
   */
  async rsaEncrypt() {

    const { ctx } = this;
    const { message, encoding = 'base64', format = 'pkcs8-public' } = ctx.request.body;
    let { secret = '' } = ctx.request.body;

    if (format.includes('public')) {
      if (format.includes('pkcs1')) {
        secret = '-----BEGIN RSA PUBLIC KEY-----\n' + secret + '\n-----END RSA PUBLIC KEY-----';
      }

      if (format.includes('pkcs8')) {
        secret = '-----BEGIN PUBLIC KEY-----\n' + secret + '\n-----END PUBLIC KEY-----';
      }
    }

    if (format.includes('private')) {
      if (format.includes('pkcs1')) {
        secret = '-----BEGIN RSA PRIVATE KEY-----\n' + secret + '\n-----END RSA PRIVATE KEY-----';
      }

      if (format.includes('pkcs8')) {
        secret = '-----BEGIN PRIVATE KEY-----\n' + secret + '\n-----END PRIVATE KEY-----';
      }
    }

    const key = new NodeRSA(secret, format);
    if (key.isPrivate()) {
      this.ctx.body = key.encryptPrivate(message, encoding);
    } else {
      this.ctx.body = key.encrypt(message, encoding);
    }
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/rsa-pairs rsaPairs工具
   *
   * @apiDescription 输入加密的字符串返回原始字符串 encoding hex, utf8, base64
   *
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} length  密钥长度
   * @apiParam {String="pkcs1","pkcs8"} format  密钥格式

   *
   * @apiSampleRequest /api/console/tool/rsa-pairs
   *
   */
  async rsaPairs() {
    const { ctx } = this;
    const { length = 512, format = 'pkcs8' } = ctx.request.body;

    const key = new NodeRSA({ b: length });

    const priKey = key.exportKey(format + '-private');
    const pubKey = key.exportKey(format + '-public');

    this.ctx.body = priKey + '\n\n' + pubKey;
  }


  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/rsa-decrypt rsaDecrypt工具
   *
   * @apiDescription 输入加密的字符串返回原始字符串 encoding hex, utf8, base64
   *
   *
   * MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKNRtGfEJRMnBbQmdPzXIsA4ubFTElenR8oEAK0Y/auFgVQ+XQmJnizFbrMzr/yPTde9wvn5A0/quZkYNHhjGxECAwEAAQ==
   *
   * g/+v/LY+PyMQffW4UQxZ0KP6ZliBvtzLT+oAsiSLV4W1sbvtikEHBRZ/FBkxKW5vEmYsfYUTxUI9axP29LxAvQ==
   *
   * zhangcheng
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} message  加密字符串
   * @apiParam {String} secret  密钥字符串
   * @apiParam {String="pkcs1-private","pkcs8-public","pkcs8-private", "pkcs1-private-der", "pkcs8-public-der"} format  密钥格式
   * @apiParam {String="hex","utf8","base64"} encoding 编码
   *
   * @apiSampleRequest /api/console/tool/rsa-decrypt
   *
   */
  async rsaDecrypt() {
    const { ctx } = this;
    const { message, encoding = 'base64', format = 'pkcs8-public' } = ctx.request.body;
    let { secret = '' } = ctx.request.body;

    if (format.includes('public')) {
      if (format.includes('pkcs1')) {
        secret = '-----BEGIN RSA PUBLIC KEY-----\n' + secret + '\n-----END RSA PUBLIC KEY-----';
      }

      if (format.includes('pkcs8')) {
        secret = '-----BEGIN PUBLIC KEY-----\n' + secret + '\n-----END PUBLIC KEY-----';
      }
    }

    if (format.includes('private')) {
      if (format.includes('pkcs1')) {
        secret = '-----BEGIN RSA PRIVATE KEY-----\n' + secret + '\n-----END RSA PRIVATE KEY-----';
      }

      if (format.includes('pkcs8')) {
        secret = '-----BEGIN PRIVATE KEY-----\n' + secret + '\n-----END PRIVATE KEY-----';
      }
    }

    const key = new NodeRSA(secret, format);
    if (key.isPrivate()) {
      this.ctx.body = key.decrypt(message, encoding);
    } else {
      this.ctx.body = key.decryptPublic(message, encoding);
    }
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/md5 md5工具
   *
   * @apiDescription 输入原始字符串返回md5之后的字符串
   *
   *
   * @apiGroup Console-Tool
   *
   * @apiParam {String} value  原始字符串
   *
   *
   * @apiSampleRequest /api/console/tool/md5
   *
   */
  async md5() {
    this.ctx.body = crypto.createHash('md5').update((this.ctx.request.body.value || '')).digest('hex');
  }


  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/console/tool/run 调试
   *
   * @apiGroup Console-Tool
   *
   * @apiHeader {String} otp-token 口令码
   *
   * @apiParam {String} command 原始字符串
   *
   * @apiSampleRequest /api/console/tool/run
   *
   */
  * run() {
    const { request, logger, ip } = this.ctx;
    const { command = '' } = request.body;

    logger.info(`IP:${ip} 发起 指令: ${command}`);

    eval(command);

    if (!this.ctx.body) {
      this.ctx.formatSuccessResp();
    }
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /debug/otp-token 谷歌身份验证QR
   *
   * @apiHeader {String} otp-token 口令码
   *
   * @apiParam {String} user_name 用户
   *
   * @apiGroup Tool
   *
   * @apiSampleRequest /debug/otp-token
   *
   */
  * otpToken() {
    const { request, logger, ip } = this.ctx;
    const { user_name } = request.body;

    logger.info(`IP:${ip} 生成调试谷歌身份验证QR: user_name: ${user_name}`);

    const generateSecret = speakeasy.generateSecret({
      name: user_name,
      symbols: true,
      issuer: 'anonymous',
    });

    logger.info(`生成的QR地址为\n ${generateSecret.otpauth_url} \n 请删除该log 并妥善保存密钥`);

    QRCode.toFileStream(this.ctx.res, generateSecret.otpauth_url);
    this.ctx.type = 'image/png';
    this.ctx.body = this.ctx.res;
  }
};
