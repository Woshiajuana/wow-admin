'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const randomstring = require('randomstring');

module.exports = class FileController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    post('/api/v1/file/*',
      middlewares.accessToken(),
      controller.uploadFile);

    get('/api/v1/file/*',
      // middlewares.accessToken(),
      controller.downLoadFile);
  }

  async uploadFile() {
    const { ctx, logger, config } = this;

    const fileDir = '/' + ctx.params[0];

    const uploadOpts = {
      uploadDir: path.join(config.fileRootDir, fileDir),
      uploadFileName(originalFileName) {
        return randomstring.generate(6) + '-' + originalFileName;
      },
    };

    const file = await this.service.fileUploadService.upload(uploadOpts);
    ctx.formatSuccessResp({
      data: {
        fileName: file.fileName,
        fileDir,
        rootDir: config.fileRootDir,
        publicUrl: `${ctx.origin}/api/v1/file${fileDir}/${file.fileName}`,
      },
    });

    logger.info('上传文件成功');
  }

  async downLoadFile() {
    const { ctx, logger, config } = this;

    const absPath = path.join(config.fileRootDir, '/' + ctx.params[0]);
    const downLoadOpts = {
      downloadDir: absPath.substr(0, absPath.lastIndexOf('/') + 1),
      downLoadFileName: absPath.substr(absPath.lastIndexOf('/') + 1),
    };

    await this.service.fileUploadService.download(downLoadOpts);

    logger.info('下载文件成功');
  }
};
