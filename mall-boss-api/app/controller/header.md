------

![](../assets/header.gif)

------

> ## 约定:

+ 接口描述和结构`[MUST]`优先以apidoc文档的形式落地并作为沟通和变动依据
+ 接口[SHOULD]满足Restfull API的设计规范
+ apidoc中提供的接口`[MUST]`可以直接使用apidoc文档调试的
+ 对与apidoc文档的书写`[MUST]`写业务场景描述入参数返回等务必做到详尽
+ 每个应用在apidoc的头部`[MUST]`描述该应用对于api的返回结构统一说明和设计
+ 涉及跨团队的接口`[SHOULD]`声明Owner以方便测试人员跟进
+ 对每个接口`[MAY]`写上Author，这样做的会更清晰的定位到实际的维护者

-----

> 该页面会提供一个Example的规范，请各位大佬参考下

> ## NODE API 路径规范（工程内目录最好建议保持一致）:

> /api/[web|biz|console]/v1/bizGroup/controller/action
> /api/[使用者         ]/版本/业务组/controller/action

* 业务组： 一些列具有业务相关性的组。 比如 operator 包含：SessionController, User 相关等

bizGroup:
+ operator 包含： 登录，忘记密码，找回，菜单， 绑定google
+ eims 包含： 邮件，短信，图片验证码，文件上传
+ org 包含代理商， 商户，平台
+ trade 包含交易，报表

