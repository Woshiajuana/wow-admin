'use strict';


const Service = require('egg').Service;
const crypto = require('crypto');
const urlencode = require('urlencode');

module.exports = class EmailService extends Service {

  async sendEmail(body, subject, to, appId, appKey) {
    const { logger } = this.app;

    logger.info(`开始发送邮件,to:${to},appId:${appId},appKey:${appKey} >>>>>`);

    body = urlencode(body, 'gbk');

    subject = urlencode(subject, 'gbk');

    const sendData = {
      to,
      subject,
      body,
      appId,
    };

    const msgContentArr = [];
    Object.keys(sendData).sort().forEach(key => {
      msgContentArr.push(`${key}=${sendData[key]}`);
    });

    const msgContent = msgContentArr.join('&') + `&key=${appKey}`;

    sendData.sign = crypto.createHash('sha1').update(msgContent).digest('hex');

    const email = await this.service.smsService.curl('/api/v1/sms/send-email', {
      data: sendData,
    });

    return email;

  }
};
