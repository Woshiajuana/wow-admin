import './utils/promise'

const components = require.context('./components', true, /index\.vue$/); // 不支持变量传路径
const pages = require.context('./pages', true, /index\.vue$/);

// appRuntime.http.get() // axios , get post put delete create all

// 处理不同环境下的api规则变化
let api = '';
const hostArr = window.location.host.split('.');
hostArr[0] = hostArr[0].replace('boss', 'boss-api');
api = window.location.protocol + '//' + hostArr.join('.') + '/api'; // 约定boss.对应域名boss-api

const initConfig = {
  httpConfig: { // 组件内部 this.$http 访问  //axios
    baseURL: process.env.VUE_APP_BASE_API_URL || api, // 参数是api地址 优先取本地配置
    timeout: 60000,

    // // http request respone info
    // accessKey: 'access-token',
    // respCodeKey: 'respCode',
    // respMessageKey: 'respMessage',
    // successCode: 'S0001',
    // requestHeaderKeys: ['device-uuid'],
    // responseHeaderKeys: ['set-access-token'],

    // // cover
    // httpRequestSuccess: () => {},
    // httpRequestError: () => {},
    // httpResponseSuccess: () => {},
    // httpResponseError: () => {},
  },
  appConfig: {
    baseURL: process.env.VUE_APP_BASE_API_URL || api,
    // // global appConfig
    // appTitle: 'app',
    // logoName: 'app',
    // logoUrl: 'img/logo.png',
    // icp: '',

    // dashboardRoute: 'dashboard', // default dashboardRoute dashboard component
    // homeRoute: '/home/dashboard', // default homeRoute redirect path
    // pageNotFoundRoute: '/home/pageNotFound',
    // forbiddenRoute: '/home/forbidden',

    // isProduction: process.NODE_ENV === 'production',
    // mode: process.env.VUE_APP_MODE,
    // defaultUsername: process.env.VUE_APP_DEFAULT_USERNAME,
    // defaultPassword: process.env.VUE_APP_DEFAULT_PASSWORD,
    // API: process.env.VUE_APP_BASE_API_URL,
  },
  appConst: { // 配置常量，组件内部 this.$appConst.getBizInfo 访问
     getBizInfo: 'abc',

     /** 店铺相关接口 */
     // 店铺列表查询
     reqShopList: '/v1/shop/list',
     // 店铺明细查询
     reqShopDetail: '/api/v1/mall/queryShopByShopNo',
     // 所属平台查询
     reqPlatformList: '/v1/platform/list',
     // 添加店铺
     doAddShopInfo: '/v1/shop/create',
     // 修改店铺
     doUpdateShopInfo: '/v1/shop/update',
     // 店铺状态切换
     doUpdateShopStatus: '/v1/shop/toggle-status',
     // 检验店铺是否存在
     doCheckShop: '/v1/shop/check-shop',

     /** 商品相关接口 */
     // 商品列表查询
     reqGoodsList: '/v1/goods/list',
     // 商品详情查询
     reqGoodsDetail: '/v1/goods/query',
     // 店铺列表下拉查询
     reqEnumShop: '/v1/enum/',
     // 商品新增
     doAddGoodsInfo: '/v1/goods/create',
     // 商品修改
     doUpdateGoodsInfo: '/v1/goods/update',
     // 商品上、下架
     doToggleStatus: '/v1/goods/toggle-status',
     // 商品图片上传
     doUploadFile: '/base/v1/utlis/oss-file/goods/',

     /** 交易订单相关接口 */
     // 订单列表查询
     reqOrderList: '/v1/trade/order/list',
     // 订单详情查询
     reqOrderDetails: '/v1/trade/order/query',

     /** 分润管理相关接口 */
     // 分润列表查询
     reqProfitList: '/v1/shareProfit/list',

     // 批量导入运单号
     expressImport: '/v1/express/import-waybill',


  },
  utlisConfig: {
    // 挂载到this.$[attr] 实例上，即下面的utlis
  },
  routerConfig: {
    // 手动添加路由 ,路由访问以及懒加载自行配置
    // isCoverRoutes:false, // 默认为false, 如果开启，routes会有效，配置会重写框架自带的routes，包括login,home，以及beforeEnter行为
    // scrollBehavior: () => ({ y: 0 }),
    // mode: 'hash',
    // routes: [], // 只有isCoverRoutes 开启才有效，此时rootRoutes以及homeRoutes都无效，importPages会自动导入routes里面path为/home路由下children中作为子路由
    // rootRoutes: [], // 会在root routes 从前面添加，以方便覆盖框架默认的，用来添加一些不属于home的路由
    // homeRoutes: [], // 会在root routes 里面的自带home路由添加子路由，优先级 : routerConfig.routes > importPages > 默认
    importPages: [
      pages, // 自动导入 pages 文件夹下页面，入口为index. 由于自动导入，vue pages文件夹下的文件夹名请以驼峰方式，跟sql菜单资源的resource_code及action_params 一致 ，访问路径即/#/home/ 文件夹名
    ],
  },
  vueConfig: {
    // render: '',
    // root: '',
    importComponents: [
      components, // 自动注册 components 文件夹下文件夹名为组件名，入口为index.vue
    ],
  },
};
console.log(window.appRuntime)
// const { app, utlis } = window.appRuntime.init(initConfig);
// window.poppyUtils = utlis;
// console.log('poppyUtils', poppyUtils); // 返回运行时内部vue实例上的工具

