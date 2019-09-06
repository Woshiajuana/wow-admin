'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  static route(app) {
    app.router.get('/', app.controller.home.heath);
    app.router.get('/health', app.controller.home.heath);
  }

  /**
   *
   * @apiVersion 1.0.0
   *
   * @api {get} API_PATH_STRUCTURE API路径结构
   *
   * @apiDescription /v1/{module_name}/{resource_name}[s]/[{resource_id}]
   *
   * 注：
   *
   * module_name: 模块名
   *
   * resource_name 资源名（单数）
   *
   * resource_names 资源名（复数）
   *
   * resource_id 资源唯一标识（id, order_no, ....）
   *
   * [POST] /v1/{module_name}/{resource_name} 新建
   *
   * [DELETE] /v1/{module_name}/{resource_name}/{resource_id} 删除
   *
   * [GET] /v1/{module_name}/{resource_name}/{resource_id} 详情
   *
   * [PUT] /v1/{module_name}/{resource_name}/{resource_id} 修改
   *
   * [GET] /v1/{module_name}/{resource_names} 列表
   *
   * @apiGroup Contract
   *
   */

  /**
   *
   * @apiVersion 1.0.0
   *
   * @api {get} API_PARSMS_NSMEING_Contract API参数命名规范
   *
   *
   * @apiDescription
   *
   * 所有参数均以下划线，小写连接 如 sms_capture
   *
   * 所有header中参数 均以中划线，小写连接 如 access-token
   *
   * 所有路径中参数 均以中划线，小写连接 如 v1/lost-found/login-password 用户登录密码找回
   *
   * resource_names 资源名（复数）
   *
   * @apiGroup Contract
   *
   */

  /**
   * @apiVersion 1.0.0
   *
   * @api {get} API-Message-Format API消息格式
   *
   * @apiDescription 这里定义了该API消息格式，所有的API响应必须满足改API的消息格式定义
   *
   * 详见(返回消息结构)中的描述.
   *
   * 1. 对于每个API成功返回，结构除了data其他基本一致，如下，后面每个API返回不在赘述， 成功只描述data部分。
   * 2. 对于每个API失败返回，如下，后面每个API返回只描述respCode 和 respMessage 其他不在赘述。
   * 3. 对于参数字段默认都为必填，下面不在描述，可选的参数 会以 [可选] 的形式 特别说明
   *
   * 注，对于测试标记的API，不详细些错误原因了
   *
   * @apiGroup Contract
   *
   * @apiSuccess (返回消息结构) {String} respCode 返回响应码 [必填]
   * @apiSuccess (返回消息结构) {String} respMessage 返回响应消息 [可选]
   * @apiSuccess (返回消息结构) {String} respErrorDetails 返回响应消息 [可选][仅仅开发测试环境 出错时][可以开关控制]
   * @apiSuccess (返回消息结构) {Object} data 返回数据 [可选]
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "respCode": "S0001",
   *       "respMessage": "成功"
   *       "data": {
   *        "name": "hello"
   *       }
   *     }
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "respCode": "F0008",
   *       "respMessage": "XXXXXX"
   *     }
   *
   */

  /**
   *
   * @apiVersion 1.0.0
   *
   * @api {get} COMMON-RESPONSE-CODE 通用API返回码表
   *
   * @apiDescription 这里定义了该API消息中，所有的API返回码和对应默认消息文字
   *
   * 注：所有错误均可以由配置文件 自定义, 定义方式 app.ymal respCfg.F403
   *
   * @apiGroup Contract
   *
   * @apiSuccess (公共) S0001 成功
   *
   * @apiError (公共) F401 未授权
   * @apiError (公共) F403 禁止访问
   * @apiError (公共) F404 资源不存在
   * @apiError (公共) F429 频繁请求，请稍后尝试
   * @apiError (公共) F500 服务异常
   *
   */

  /**
   *
   * @apiVersion 1.0.0
   *
   * @api {get} /health 健康检查
   *
   * @apiDescription 这里定义了该API消息中，所有的API返回码和对应默认消息文字
   *
   * @apiGroup HEATH
   *
   * @apiSampleRequest /health
   *
   */
  async heath() {
    this.ctx.body = "hi~, I'm ok";
  }

}

module.exports = HomeController;
