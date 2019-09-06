/**
 * Created by alex on 2017/9/13.
 */

'use strict';

const Controller = require('egg').Controller;
const QRCode = require('qrcode');

module.exports = class ImageQRCodeController extends Controller {

  static route(app, middlewares, controller) {

    app.router.get('/api/base/v1/utlis/image-qrcode',
      // middlewares.accessToken(),
      // middlewares.authToken({module: 'getCaptcha'}),
      controller.qrcode);
  }
  /**
   * @apiVersion 1.0.0
   * @api {get} /api/base/v1/utlis/image-qrcode 返回二维码
   *
   * @apiParam {String} content 二维码内容
   * @apiParam {String} size 尺寸 默认200
   * @apiParam {String} margin 边距 默认4
   *
   *
   * @apiDescription 注意返回的是媒体媒体类型，非json数据
   *
   * 用于svg的图片返回 打开浏览器 网络查看详细返回
   *
   * @apiGroup ImageQRCode
   *
   * @apiSampleRequest /api/base/v1/utlis/image-qrcode
   *
   */
  async qrcode() {
    const { ctx } = this;
    const { query, logger } = ctx;

    const content = query.content || '';
    const size = parseInt(query.size) || 200;
    let margin = parseInt(query.margin);
    // const backColor = decodeURIComponent(query.back || '#000000ff');
    // const frontColor = decodeURIComponent(query.front || '#ffffffff');

    if (isNaN(margin)) {
      margin = 2;
    }

    logger.info(`qrcode: ${JSON.stringify(query.content)}`);

    QRCode.toFileStream(ctx.res, content, {
      width: size,
      margin,
      errorCorrectionLevel: 'L',
      // color: {
      //   dark: frontColor,
      //   light: backColor,
      // }
    });

    ctx.type = 'image/png';
    ctx.body = ctx.res;
  }
}
