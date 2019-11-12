
'use strict';

import CaptchaPng                       from 'captchapng'
import svgCaptcha                       from 'svg-captcha'

const { Service } = require('egg');

module.exports = class HandleServer extends Service {

    // 生成图形验证码
    async generate (email) {
        let text = randomNum(6);
        let captchaPng = new CaptchaPng(80, 30, text);
        captchaPng.color(255, 255, 255, 0);  // First color: background (red, green, blue, alpha)
        captchaPng.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        // let data = new Buffer(captchaPng.getBase64(), 'base64');
        let data = captchaPng.getBase64();
        // let {
        //     text,
        //     data,
        // } = svgCaptcha.create( {
        //     size: 5, // 验证码长度
        //     ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        //     noise: 2, // 干扰线条的数量
        //     height: 44
        // });
        await redisUtil.setItem(`${email} captcha`, text);
        return data;
    }
};

function randomNum (len) {
    let result = '';
    while (len > 0) {
        len--;
        result += Math.floor(Math.random() * 10)
    }
    return result;
}
