/**
 * Created by alex on 2017/9/13.
 */

'use strict';

const Controller = require('egg').Controller;

module.exports = class ImageCaptchaController extends Controller {
  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    get('/api/base/v1/utlis/imageCaptcha/getCaptcha', controller.getCaptcha);
    post('/api/base/v1/utlis/imageCaptcha/createCaptcha', controller.createCaptcha);
  }

  /**
   * @apiVersion 1.0.0
   * @api {get} /api/base/v1/utlis/imageCaptcha/getCaptcha 获取图片验证码媒体
   *
   * @apiParam {String} token 验证码图片token
   *
   * @apiDescription 注意返回的是媒体媒体类型，非json数据
   *
   * 用于svg的图片返回 打开浏览器 网络查看详细返回
   *
   * @apiGroup utlis
   *
   * @apiSampleRequest /api/base/v1/utlis/imageCaptcha/getCaptcha
   *
   */
  async getCaptcha() {
    const imageToken = this.ctx.query.token;
    if (!imageToken) {
      this.ctx.throwError('token参数不能为空', 'F400');
      return;
    }

    await this.service.imageCaptchaService.getCaptchaImageMedia(imageToken);
  }

  /**
   * @apiVersion 1.0.0
   * @api {post} /api/base/v1/utlis/imageCaptcha/createCaptcha 创建图片验证码
   *
   * @apiDescription 这里返回的 img_captcha_token 过期时间默认2分种，可以修改业务配置 imageCaptchaTokenMaxAge 单位 (秒 s 分m 时 h 天d 年 y)
   *
   * 详细单位解释参考 https://www.npmjs.com/package/ms
   *
   * @apiGroup utlis
   *
   * @apiSuccess (成功) {Object} data
   * @apiSuccess (成功) {String} data.img_captcha_token 返回验证码图片的token，用于校验图片验证码
   * @apiSuccess (成功) {String} data.img_url 返回验证码图片的svg url 数据
   *
   * @apiSampleRequest /api/base/v1/utlis/imageCaptcha/createCaptcha
   *
   */

  async createCaptcha() {
    const { token, captcha } = await this.service.imageCaptchaService.createCaptcha();
    this.ctx.formatSuccessResp({
      data: {
        img_captcha_token: token,
        img_url: `${this.ctx.origin}/api/base/v1/utlis/imageCaptcha/getCaptcha?token=${token}`,
        captcha,
      },
    });
  }
};
