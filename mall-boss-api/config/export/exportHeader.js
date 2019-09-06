'use strict';
const formatter = require('./formatters');

const _ = (key, label, handle) => {
  return {
    key,
    label,
    handle,
  };
};

const toYuan = val => formatter.formatMoney(val, 'YUAN');
const time = val => formatter.formatDate(val);
const gradeEnum = val => {
  const enmu = [ '普通会员', 'VIP', '秀才', '探花', '榜眼', '状元', '王爷', '皇帝' ];
  return enmu[val]
};
const orderStatusEnum = val => {
  const enmu = [ '', '待支付', '订单已关闭', '待发货(支付成功)', '支付失败', '已发货' ];
  return enmu[val];
};
const payWayEnum = val => {
  const enmu = {
    'alipay': '支付宝'
  };
  return enmu[val];
};

module.exports = {
  tradeList: [
    // _('id', 'id'),
    // _('userNo', '用户编号'),
    // _('userName', '用户名称'),
    // _('userPhone', '用户手机'),
    // _('pfUserNo', '平台用户编号'),
    // _('pfUserName', '平台用户名称'),
    // _('pfUserPhone', '平台用户手机'),
    _('orderNo', '订单编号'),
    // _('platformNo', '平台编号'),
    // _('platformName', '平台名称'),
    // _('shopNo', '店铺编号'),
    // _('shopName', '店铺名称'),
    // _('goodsNo', '商品编号'),
    _('goodsName', '商品名称'),
    _('goodsNorms', '商品规格'),
    _('goodsPrice', '折前价格（元）', toYuan),
    _('goodsDiscountPrice', '折后价格（元）', toYuan),
    _('tradeBuyNum', '购买数量'),
    _('freightAmt', '运费（元）', toYuan),
    _('tradeAmt', '交易金额（元）', toYuan),
    _('tradePoints', '交易积分'),
    // _('surplusPoints', '可用积分'),
    // _('tradeBalance', '交易余额（元）', toYuan),
    // _('shareProfitAmt', '分润金额（元）', toYuan),
    // _('addressId', '收货地址ID'),
    // _('deductPointsStatus', '积分抵扣状态'),
    // _('profitStatus', '分润状态'),
    _('channelPayNo', '支付订单号'),
    _('payWay', '支付方式', payWayEnum),
    _('orderStatus', '订单状态', orderStatusEnum),
    // _('channelCode', '通道返回码'),
    // _('channelMsg', '通道返回信息'),
    _('channelPayTime', '支付完成时间'),
    _('contactName', '联系人'),
    _('contactPhone', '联系人手机'),
    _('province', '收货人省份'),
    _('city', '收货人城市'),
    _('county', '收货区县'),
    _('contactAddress', '联系人地址'),
    _('fastInfo', '发货信息'),
    // _('addressLabel', '地址标签'),
    // _('thumbnailPath', '缩略图'),
    // _('status', '状态'),
    // _('createTime', '创建时间'),
    // _('updateTime', '更新时间'),
  ],
  shareProfitList: [
    // _('id', 'id'),
    _('profitNo', '分润单号'),
    // _('platformNo', '平台编号'),
    // _('platformName', '平台名称'),
    // _('shopNo', '店铺编号'),
    // _('shopName', '店铺名称'),
    _('goodsNo', '商品编号'),
    _('goodsName', '商品名称'),
    _('goodsNorms', '商品规格'),
    _('tradeBuyNum', '购买数量'),
    _('orderNo', '订单编号'),
    _('payOrderNo', '支付订单号'),
    // _('userNo', '用户编号'),
    // _('userPhone', '用户手机'),
    _('pfUserNo', '用户编号'),
    // _('pfUserName', '用户名称'),
    // _('pfUserPhone', '用户手机'),
    _('pfUserGrade', '用户等级'),
    _('profitAmt', '分润金额（元）', toYuan),
    _('profitTotalAmt', '分润总金额（元）', toYuan),
    _('createTime', '创建时间'),
  ],
};
