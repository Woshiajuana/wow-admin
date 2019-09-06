'use strict';
const Service = require('egg').Service;
const Excel = require('exceljs');
const moment = require('moment');
const del = require('del');

module.exports = class ExcelService extends Service {

  async load(file) {
    const filepath = file.filepath;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filepath);
    const data = {};
    workbook.eachSheet((worksheet, sheetId) => {
      const sheetRows = [];
      worksheet.eachRow(row => {
        const rowValues = row.values.filter(item => item);
        sheetRows.push(rowValues);
      });
      data[worksheet.name || sheetId] = sheetRows;
    });

    const deleteResult = await del(filepath, { force: true });
    if (!deleteResult) {
      console('Delete tmp file fail:' + deleteResult);
    }

    return { workbook, data };
  }

  async export(originData, title = '查询') {
    const { ctx, logger, app } = this;
    const { accessData = {}, helper } = ctx;

    if (!originData.count) {
      logger.info(`缺少count 导出 ${title} 失败`);
      ctx.throwError('缺少count 导出失败', 'F400');
      return;
    }
    if (!originData.list) {
      logger.info(`缺少list[] 导出 ${title} 失败`);
      ctx.throwError('缺少list[] 导出失败', 'F400');
      return;
    }
    if (!originData.header) {
      logger.info(`缺少header[] 导出 ${title} 以字段为头部`);
    }
    if (!originData.footer) {
      logger.info(`缺少footer[] 导出 ${title} footer 无内容`);
    }

    const exportData = this.toExportList(originData);

    const dateFiledInfo = Object.assign(
      { startTime: true, endTime: true, createdAt: true, updateAt: true, createTime: true, updateTime: true },
      originData.dateFileds || {}
    );

    if (!originData.dateFileds) {
      logger.info(`缺少dateFileds{} 导出 ${title} 日期时间戳 可能无格式化, 默认格式化字段: ${JSON.stringify(dateFiledInfo)}`);
    }

    const exportDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const downloadFileName = `${title}-${exportDate}`;

    const summaryAttrMap = exportData.summary.attrMap || [];
    const headerItems = exportData.header || [];
    const contentItems = exportData.content || [];

    logger.info(`userId: ${accessData.id} 导出 ${title} 开始 time:${exportDate}`);

    // create work book
    const workbook = new Excel.Workbook();

    // create sheet
    const worksheet = workbook.addWorksheet(title);
    // add page header
    worksheet.addRow([
      title,
      '导出时间:',
      exportDate,
    ]);
    // blank rows
    worksheet.addRow([]);

    // attr map
    let summaryItems = [];
    if (summaryAttrMap && Object.keys(summaryAttrMap)[0]) {
      summaryItems = Object.keys(summaryAttrMap).map(key => {
        return {
          key,
          value: summaryAttrMap[key].value,
          label: summaryAttrMap[key].label,
        };
      });
    }

    // summary items
    const summaryRows = [];
    if (summaryItems[0]) {
      summaryItems.forEach(item => {
        summaryRows.push(`${item.label}:`);
        summaryRows.push(`${item.value}`);
      });
    }

    worksheet.addRow(summaryRows);

    // blank rows
    worksheet.addRow([]);

    // columns info
    const columnsInfo = [];

    // header area set the header
    const headerRows = [];
    let headerInfo = headerItems;
    if (!headerItems[0] && contentItems[0]) {
      headerInfo = Object.keys(contentItems[0]).map(key => ({ key, label: key }));
    }
    headerInfo.forEach(item => {
      headerRows.push(`${item.label}`);
      columnsInfo.push({ width: 25 });
    });
    const headerExcelRow = worksheet.addRow(headerRows);
    worksheet.columns = columnsInfo;
    headerExcelRow.fill = {
      bgColor: { argb: 'FF0000FF' },
    };

    // content area set the content
    contentItems.forEach(contentItem => {

      // contentRows.
      const contentRows = [];
      let dateRows = '';
      headerInfo.forEach(item => {
        const headerKey = item.key;
        const arr = headerKey.split('.');
        if (arr.length === 1) {
          const value = typeof item.handle === 'function' ? item.handle(contentItem[headerKey]) : contentItem[headerKey];
          dateRows = value !== undefined && value !== null ? String(value) : ''; // fix 0
        } else if (arr.length === 2) {
          dateRows = contentItem[arr[0]][arr[1]];
        }
        // formatter date
        if (dateFiledInfo.hasOwnProperty(headerKey)) {
          if (contentItem[headerKey] !== null && contentItem[headerKey] !== '') {
            dateRows = moment(contentItem[headerKey]).format('YYYY-MM-DD HH:mm:ss');
          }
        }

        contentRows.push(dateRows || '');
      });

      worksheet.addRow(contentRows);
    });

    // // summary area set the summary
    // await workbook.xlsx.write(ctx.res);
    // ctx.body = ctx.res;
    ctx.body = await workbook.xlsx.writeBuffer();
    ctx.type = 'application/octet-stream';
    ctx.response.attachment(`${downloadFileName}.xlsx`);

    logger.info(`userId: ${accessData.id} 导出 ${title} 结束 time:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  }

  toExportList({ count = '', list = [], title = '', header = [], footer = '' }) {
    return {
      summary: {
        title,
        attrMap: {
          totalCount: {
            label: '总条数',
            value: count,
          },
        },
      },
      header,
      footer,
      title,
      content: list,
    };
  }
};
