'use strict';

const Controller = require('egg').Controller;

module.exports = class ExpressController extends Controller {

  static route(app, middlewares, controller) {
    const { all, post, get } = app.router;

    post('/api/v1/express/import-waybill',
      middlewares.accessToken(),
      controller.importWaybill);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/express/import-waybill 批量导入运单号
   *
   * @apiDescription 批量导入运单号
   *
   * @apiGroup Trade
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/express/import-waybill
   *
   */

  async importWaybill() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const { } = accessData;

    const file = ctx.request.files[0];

    if (!file || !file.filename) {
      ctx.throwError('Please select a file to upload', 'F400');
      return;
    }

    let fastInfoList = [];
    const loadResult = await service.base.utlis.excelService.load(file);
    const loadData = loadResult.data;
    const templateRules = {
      headerRow: [ '订单号', '快递公司', '快递单号' ],
    };

    let loadErrorMessage = '';
    const lackRows = [];
    Object.keys(loadData).forEach(key => {
      const headerRow = loadData[key][0];
      const contentRows = loadData[key].slice(1);

      // verify headerRules
      templateRules.headerRow.forEach((item, index) => {
        if (!item.includes(headerRow[index].trim())) {
          const matchValues = typeof item === 'string' ? [ item ] : item;
          const takeValueRange = '【' + matchValues.join('、') + '】';
          loadErrorMessage += `第${index + 1}列字段错误,取值应为${takeValueRange}/n`;
        }
      });
      // take contentRows values
      contentRows.forEach((item, index) => {
        if (item.length !== 3) {
          lackRows.push(index + 2);
          return;
        }
        const orderNo = String(item[0]).trim();
        const fastCompanyStrs = String(item[1]).split('|');
        const fastNoStrs = String(item[2]).split('|');

        const fastInfoItem = fastCompanyStrs.filter((item, index) => fastNoStrs[index]).map((item, index) => {
          return {
            orderNo,
            fastCompany: item.trim(),
            fastNo: fastNoStrs[index].trim(),
          };
        });

        fastInfoList = fastInfoList.concat(fastInfoItem);
      });
      if (lackRows[0]) {
        loadErrorMessage += `第${lackRows.join(',')}行,数据不全,请检查!`;
      }
    });

    if (loadErrorMessage) {
      logger.info(`operator: ${accessData.id} 批量导入运单号 失败! 模版错误: ${loadErrorMessage}`);
      ctx.throwError(`模版错误,请修正后重新上传 错误信息:${loadErrorMessage}`, 'F400');
      return;
    }

    const params = {
      fastInfoList,
    };

    logger.info(`operator: ${accessData.id} 批量导入运单号 开始>>>>${JSON.stringify(params)}`);

    const data = await service.pass.scoreMallService.curl('/v1/mall/addFast', {
      method: 'post',
      data: params,
    });

    ctx.formatSuccessResp({ data });

    logger.info(`operator: ${accessData.id} 批量导入运单号 成功！ ip: ${ctx.ip}`);
  }

};

