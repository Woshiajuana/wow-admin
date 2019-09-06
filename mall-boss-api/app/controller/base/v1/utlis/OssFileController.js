'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const uuid = require('uuid');

module.exports = class OssFileController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/base/v1/utlis/oss-file/*',
      // middlewares.accessToken(),
      controller.uploadFile);
  }

  async uploadFile() {
    const { ctx, logger, config } = this;
    const params = ctx.params ? ctx.params[0] : '';
    const fileDir = params ? params.endsWith('/') ? ctx.paramsp[0] : ctx.params[0] + '/' : '';

    const file = ctx.request.files[0];

    if (!file || !file.filename) {
      ctx.throwError('Please select a file to upload', 'F400');
      return;
    }

    // random info
    const randomName = uuid();
    const randomDir = randomName.substr(0, 2);

    // get file suffix
    const splitName = file.filename.split('.');
    const suffix = splitName.length > 1 ? splitName[splitName.length - 1] : '';

    // fileName
    const fileName = randomName + '.' + suffix;

    // uploadPath
    const uploadPath = fileDir + randomDir + '/' + fileName;
    const result = await ctx.oss.put(uploadPath, file.filepath);

    if (!result) {
      ctx.throwError('Please select a file to upload', 'F400');
    }
    if (result.res && result.res.statusCode !== 200) {
      logger.info(`上传文件失败${result.res}`);
      ctx.formatFailResp({ errCode: 'F490003' });
      return;
    }

    ctx.formatSuccessResp({
      data: {
        fileName: file.filename,
        fileDir,
        rootDir: randomDir,
        publicUrl: result.url,
      },
    });

    logger.info(`上传文件成功, name:${result.name} url: ${result.url}`);
  }
};

