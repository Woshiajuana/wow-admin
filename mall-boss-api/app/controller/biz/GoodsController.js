'use strict';

const Controller = require('egg').Controller;

module.exports = class GoodsController extends Controller {

  static route(app, middlewares, controller) {
    const { post, get } = app.router;

    // boss
    post('/api/v1/goods/list',
      middlewares.accessToken(),
      controller.list);

    post('/api/v1/goods/query',
      middlewares.accessToken(),
      controller.query);

    post('/api/v1/goods/create',
      middlewares.accessToken(),
      controller.create);

    post('/api/v1/goods/update',
      middlewares.accessToken(),
      controller.update);

    post('/api/v1/goods/toggle-status',
      middlewares.accessToken(),
      controller.toggleStatus);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/goods/list 商品列表
   *
   * @apiDescription 商品列表
   *
   * @apiGroup goods
   *
   * @apiParam  {String} [shopNo] 店铺编号
   * @apiParam  {String} [goodsName] 商品名称
   * @apiParam  {String} [platformNo] 平台编号
   * @apiParam  {String} [goodsBuyArea] 是否抢购专区
   * @apiParam  {String} [isHot] 是否热门
   *
   * @apiParam  {String} [pageNum] 页码
   * @apiParam  {String} [pageSize] 条数
   * @apiParam  {String} [startTime] 开始时间
   * @apiParam  {String} [endTime] 结束时间
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/goods/list
   *
   */

  async list() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { shopNo, goodsName, platformNo, goodsBuyArea, isHot, pageNum = '1', pageSize = '20', startTime, endTime } = requestData;

    logger.info(`userId: ${accessData.id} 查询 商品列表 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/queryGoodsList', {
      method: 'post',
      data: {
        shopNo,
        goodsName,
        platformNo,
        goodsBuyArea,
        isHot,
        pageNum,
        pageSize,
        startTime,
        endTime,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 商品列表 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/goods/query 商品查询
   *
   * @apiDescription 商品查询
   *
   * @apiGroup goods
   *
   * @apiParam  {String} [goodsId] 商品编号
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/goods/query
   *
   */

  async query() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { goodsId } = requestData;

    if (!goodsId) {
      logger.info(`goodsId为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('goodsId不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 查询 商品查询 开始>>>>${JSON.stringify(requestData)}`);
    const result = await service.pass.scoreMallService.curl('/v1/mall/queryGoodsByNo', {
      method: 'post',
      data: {
        goodsId,
      },
    });

    const thumbnailImg = {};
    const wheelPlantingImg = {};
    const detailsImg = {};

    if (result.fileList && result.fileList[0]) {
      result.fileList.forEach(item => {
        if (item.type === 'thumbnail') {
          const thumbnailImgs = item.filePath.split(',');
          thumbnailImgs.forEach((item, index) => {
            thumbnailImg[`img${index + 1}`] = item;
          });
        }
        if (item.type === 'wheelPlanting') {
          const wheelPlantingImgs = item.filePath.split(',');
          wheelPlantingImgs.forEach((item, index) => {
            wheelPlantingImg[`img${index + 1}`] = item;
          });
        }
        if (item.type === 'details') {
          const detailsImgs = item.filePath.split(',');
          detailsImgs.forEach((item, index) => {
            detailsImg[`img${index + 1}`] = item;
          });
        }
      });
    }
    const data = Object.assign({}, {
      ...result.goodsInfo,

      thumbnailImg,
      wheelPlantingImg,
      detailsImg,

      onefreightAmount: result.onefreightAmount,
      morefreightAmount: result.morefreightAmount,
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 商品查询 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/goods/create 商品创建
   *
   * @apiDescription 商品创建
   *
   * @apiGroup goods
   *
   * @apiParam  {String} platformNo 平台编号
   * @apiParam  {String} shopNo 店铺编号
   *
   * @apiParam  {String} goodsName 商品名称
   * @apiParam  {String} goodsPrice 商品单价（分）
   * @apiParam  {String} goodsDiscountPrice 商品折扣价（分）
   * @apiParam  {String} discountPoints 积分抵扣
   * @apiParam  {String} paymentPrice 支付价格（分）
   * @apiParam  {String} shareAmount 分润金额（分）
   * @apiParam  {String} goodsStockNum 商品库存
   * @apiParam  {String} limitNum 限购数量
   *
   * @apiParam  {String{值越小越靠前}} goodsSort 排序编号
   * @apiParam  {String{字符串多种规格 用 , 分割}} [goodsNorms] 商品规格
   *
   * @apiParam  {String{1、一般商品购买区域 2、抢购专区}} goodsBuyArea 商品专区
   * @apiParam  {String{normal-是 disabled-否}} isHot 是否热门推荐
   *
   * @apiParam  {String} startTime 上架时间
   * @apiParam  {String} endTime 下架时间
   * @apiParam  {String{normal-上架 disabled-下架}} [isShelf] 是否上架
   *
   * @apiParam  {String} goodsDetails 商品详情
   * @apiParam  {String} [goodsDescribe] 描述
   *
   * @apiParam  {Object} thumbnailImg 略缩图片信息
   * @apiParam  {Object} thumbnailImg.img1 略缩图片信息1
   *
   * @apiParam  {Object} wheelPlantingImg 轮播图片信息
   * @apiParam  {Object} wheelPlantingImg.img1 轮播图片信息1
   *
   * @apiParam  {Object} detailsImg 详情图片信息
   * @apiParam  {Object} detailsImg.img1 详情图片信息1
   *
   * @apiParam  {String} onefreightAmount 单件运费金额（分）
   * @apiParam  {String} [morefreightAmount] 多件运费金额（分）
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/goods/create
   *
   */

  async create() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const {
      platformNo, shopNo,
      goodsName, goodsPrice, goodsDiscountPrice, discountPoints,
      paymentPrice, shareAmount, goodsStockNum, limitNum,
      goodsSort, goodsNorms, goodsBuyArea, isHot,
      startTime, endTime,
      goodsDetails,
      thumbnailImg = {},
      wheelPlantingImg = {},
      detailsImg = {},
      onefreightAmount,
      morefreightAmount,
      isShelf,
      goodsDescribe,
    } = requestData;

    const params = {
      platformNo, shopNo,
      goodsName, goodsPrice, goodsDiscountPrice, discountPoints,
      paymentPrice, shareAmount, goodsStockNum, limitNum,
      goodsSort, goodsNorms, goodsBuyArea, isHot,
      startTime, endTime,
      goodsDetails,
      thumbnailImg,
      wheelPlantingImg,
      detailsImg,
      onefreightAmount,
      morefreightAmount,
      isShelf,
      goodsDescribe,
    };

    const verifyRules = {
      platformNo: true,
      shopNo: true,
      goodsName: true,
      goodsPrice: true,
      goodsDiscountPrice: true,
      discountPoints: true,
      paymentPrice: true,
      shareAmount: true,
      goodsStockNum: true,
      limitNum: true,
      goodsSort: true,
      goodsBuyArea: true,
      isHot: true,
      goodsDetails: true,
      thumbnailImg: 'object',
      wheelPlantingImg: 'object',
      detailsImg: 'object',
      onefreightAmount: true,
      morefreightAmount: true,
    };

    if (goodsBuyArea == 2) {
      Object.assign(verifyRules, {
        startTime: true,
        endTime: true,
      });
    }

    ctx.validate(verifyRules, requestData);

    const thumbnailPaths = this.handleImgInfo(thumbnailImg);
    const wheelPlantingPaths = this.handleImgInfo(wheelPlantingImg);
    const detailsPaths = this.handleImgInfo(detailsImg);

    const requestParams = Object.assign(params, {
      goodsPictureDto: {
        thumbnailPath: thumbnailPaths.join(','),
        wheelPlantingPath: wheelPlantingPaths.join(','),
        detailsPath: detailsPaths.join(','),
      },
      goodsFreightDto: {
        onefreightAmount: params.onefreightAmount,
        morefreightAmount: params.morefreightAmount,
      },
    });
    delete params.onefreightAmount;
    delete params.morefreightAmount;

    logger.info(`userId: ${accessData.id} 查询 商品创建 开始>>>>${JSON.stringify(params)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/addGoods', {
      method: 'post',
      data: requestParams,
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 商品创建 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/goods/update 商品更新
   *
   * @apiDescription 商品更新
   *
   * @apiGroup goods
   *
   * @apiParam  {String} goodsNo 商品编号
   *
   * @apiParam  {String} platformNo 平台编号
   * @apiParam  {String} shopNo 店铺编号
   *
   * @apiParam  {String} goodsName 商品名称
   * @apiParam  {String} goodsPrice 商品单价（分）
   * @apiParam  {String} goodsDiscountPrice 商品折扣价（分）
   * @apiParam  {String} discountPoints 积分抵扣
   * @apiParam  {String} paymentPrice 支付价格（分）
   * @apiParam  {String} shareAmount 分润金额（分）
   * @apiParam  {String} goodsStockNum 商品库存
   * @apiParam  {String} [limitNum] 限购数量
   *
   * @apiParam  {String{值越小越靠前}} goodsSort 排序编号
   * @apiParam  {String{字符串多种规格 用 , 分割}} [goodsNorms] 商品规格
   * @apiParam  {String{1、一般商品购买区域 2、抢购专区}} goodsBuyArea 商品专区
   * @apiParam  {String{normal-是 disabled-否}} [isHot] 是否热门推荐
   *
   * @apiParam  {String} startTime 上架时间
   * @apiParam  {String} endTime 下架时间
   * @apiParam  {String{normal-上架 disabled-下架}} isShelf 是否上架
   *
   * @apiParam  {String} goodsDetails 商品详情
   * @apiParam  {String} goodsDescribe 描述
   *
   * @apiParam  {Object} thumbnailImg 略缩图片信息
   * @apiParam  {Object} thumbnailImg.img1 略缩图片信息1
   *
   * @apiParam  {Object} wheelPlantingImg 轮播图片信息
   * @apiParam  {Object} wheelPlantingImg.img1 轮播图片信息1
   *
   * @apiParam  {Object} detailsImg 详情图片信息
   * @apiParam  {Object} detailsImg.img1 详情图片信息1
   *
   * @apiParam  {String} onefreightAmount 单件运费金额（分）
   * @apiParam  {String} morefreightAmount 多件运费金额（分）
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/goods/update
   *
   */

  async update() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const {
      goodsNo,
      platformNo, shopNo,
      goodsName, goodsPrice, goodsDiscountPrice, discountPoints,
      paymentPrice, shareAmount, goodsStockNum, limitNum,
      goodsSort, goodsNorms, goodsBuyArea, isHot,
      startTime, endTime,
      goodsDetails,
      thumbnailImg = {},
      wheelPlantingImg = {},
      detailsImg = {},
      onefreightAmount,
      morefreightAmount,
      isShelf,
      goodsDescribe,
    } = requestData;

    const params = {
      goodsNo,

      platformNo, shopNo,
      goodsName, goodsPrice, goodsDiscountPrice, discountPoints,
      paymentPrice, shareAmount, goodsStockNum, limitNum,
      goodsSort, goodsNorms, goodsBuyArea, isHot,
      startTime, endTime,
      goodsDetails,
      thumbnailImg,
      wheelPlantingImg,
      detailsImg,
      onefreightAmount,
      morefreightAmount,
      isShelf,
      goodsDescribe,
    };

    const verifyRules = {
      goodsNo: true,

      platformNo: true,
      shopNo: true,
      goodsName: true,
      goodsPrice: true,
      goodsDiscountPrice: true,
      discountPoints: true,
      paymentPrice: true,
      shareAmount: true,
      goodsStockNum: true,
      limitNum: true,
      goodsSort: true,
      goodsBuyArea: true,
      isHot: true,
      goodsDetails: true,
      thumbnailImg: 'object',
      wheelPlantingImg: 'object',
      detailsImg: 'object',
      onefreightAmount: true,
      morefreightAmount: true,
    };

    if (goodsBuyArea == 2) {
      Object.assign(verifyRules, {
        startTime: true,
        endTime: true,
      });
    }

    ctx.validate(verifyRules, requestData);

    const thumbnailPaths = this.handleImgInfo(thumbnailImg);
    const wheelPlantingPaths = this.handleImgInfo(wheelPlantingImg);
    const detailsPaths = this.handleImgInfo(detailsImg);

    const requestParams = Object.assign(params, {
      goodsPictureDto: {
        thumbnailPath: thumbnailPaths.join(','),
        wheelPlantingPath: wheelPlantingPaths.join(','),
        detailsPath: detailsPaths.join(','),
      },
      goodsFreightDto: {
        onefreightAmount: params.onefreightAmount,
        morefreightAmount: params.morefreightAmount,
      },
    });
    delete params.onefreightAmount;
    delete params.morefreightAmount;

    logger.info(`userId: ${accessData.id} 查询 商品更新 开始>>>>${JSON.stringify(params)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/updateGoods', {
      method: 'post',
      data: requestParams,
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 商品更新 成功！ ip: ${ctx.ip}`);
  }

  /**
   * @apiVersion 1.0.0
   *
   * @api {post} /api/v1/goods/toggle-status 商品上下架切换
   *
   * @apiDescription 商品上下架切换
   *
   * @apiGroup goods
   *
   * @apiParam  {String} goodsNo 商品编号
   * @apiParam  {String{normal-上架,disabled-下架}} status 状态
   *
   * @apiSuccess (成功) {Object} data
   *
   * @apiSampleRequest /api/v1/goods/toggle-status
   *
   */

  async toggleStatus() {
    const { ctx, app, logger, config, service } = this;
    const { accessData = {} } = ctx;
    const requestData = ctx.method === 'GET' ? ctx.query : ctx.request.body;
    const { goodsNo, status } = requestData;

    if (!goodsNo) {
      logger.info(`goodsNo为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('goodsNo不能为空', 'F400');
      return;
    }
    if (!status) {
      logger.info(`status为空 ${JSON.stringify(requestData)}`);
      ctx.throwError('status不能为空', 'F400');
      return;
    }

    logger.info(`userId: ${accessData.id} 查询 商品状态切换 开始>>>>${JSON.stringify(requestData)}`);
    const data = await service.pass.scoreMallService.curl('/v1/mall/goodsIsShelf', {
      method: 'post',
      data: {
        goodsNo,
        status,
      },
    });
    ctx.formatSuccessResp({ data });
    logger.info(`userId: ${accessData.id} 查询 商品状态切换 成功！ ip: ${ctx.ip}`);
  }

  handleImgInfo(imgInfo) {
    const returnImgPaths = [];
    const imgInfoKey = Object.keys(imgInfo);
    if (imgInfoKey.length > 0) {
      imgInfoKey.forEach(key => {
        const url = typeof imgInfo[key] === 'string' ? imgInfo[key].trim() : '';
        if (url) {
          returnImgPaths.push(url);
        }
      });
    }
    return returnImgPaths;
  }
};

