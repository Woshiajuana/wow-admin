
-- drop database if exists score_mall_new;
-- create database if not exists score_mall_new default character set utf8mb4 collate utf8mb4_general_ci;
-- grant select,insert,update,delete,create,drop,alter on 数据库名.* to 数据库名@localhost identified by '密码';
-- set password for '数据库名'@'localhost' = old_password('密码');


/**************************初始化表结构****************************/

/*初始化 组织 */
drop table if exists score_mall_new.pp_org;
CREATE TABLE score_mall_new.pp_org
(
  id                  bigint(20)  NOT NULL AUTO_INCREMENT,
  org_no              varchar(30) NOT NULL COMMENT '组织号 全局唯一， 全局第一个组织是根,规则 固定 XX000000000000000000 20位',
  belong_to_org       varchar(30) NOT NULL COMMENT '直属组织号上下级关系，eg.因为推荐形成的组织关系',
  own_to_org          varchar(30)          DEFAULT '' COMMENT '归属的组织, 一般用作夸组织的关系',
  `name`                varchar(80)          DEFAULT '' COMMENT '组织名称',
  nick_name           varchar(80)          DEFAULT '' COMMENT '组织名称昵称',
  `desc`                varchar(60)          DEFAULT '' COMMENT '组织描述',
  mobile              varchar(50)          DEFAULT '' COMMENT '手机',
  email               varchar(80)          DEFAULT '' COMMENT '邮箱',
  website             varchar(80)          DEFAULT '' COMMENT '网站',
  `type`                varchar(10) NOT NULL COMMENT '类型 可能值 root, platform xxx(作own_to_org跨组织关联)',
  `level`               smallint(6)          DEFAULT 1 COMMENT '层级 默认1级开始',
  max_level           smallint(6)          DEFAULT 8 COMMENT '改组织下面允许的最大层级',
  creator_create_type varchar(50)          DEFAULT '' COMMENT '创建人的创建方式预留',
  creator_name        varchar(50)          DEFAULT '' COMMENT '创建人名字',
  created_at          datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at          datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`              varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  KEY idx_org_org_no (org_no),
  KEY idx_org_type (type),
  KEY idx_org_belong_to_org (belong_to_org),
  KEY idx_org_own_to_org (own_to_org)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='组织';

/*初始化 APP */
drop table if exists score_mall_new.pp_org_app;
CREATE TABLE score_mall_new.pp_org_app
(
  id            bigint(20)  NOT NULL AUTO_INCREMENT,
  app_no        varchar(30) NOT NULL COMMENT 'app号 全局唯一 固定 AP000000000000000000 20位',
  org_no        varchar(30) NOT NULL COMMENT 'org_no',
  belong_to_org varchar(30) NOT NULL DEFAULT '' COMMENT '直属组织号上下级关系',
  category      varchar(30) NOT NULL COMMENT '分类 root, platform, agent 等',
  `app_code`    varchar(30) NOT NULL DEFAULT '' COMMENT 'app code org下唯一app代号',
  `type`      	varchar(30) NOT NULL COMMENT '类型 区分app是否具有管理平台和操作员',
  `name`        varchar(80)          DEFAULT '' COMMENT 'app名称',
  logo          varchar(200)         DEFAULT '' COMMENT 'logo',
  `desc`        varchar(500)         DEFAULT '' COMMENT '描述',
  theme         varchar(30)          DEFAULT '' COMMENT '皮肤',
  icp           varchar(200)         DEFAULT '' COMMENT '网站备案',
  app_info      text                 COMMENT 'app详布局样式信息',
  created_at    datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at    datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`      varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY idx_org_app_app_no (app_no),
--   UNIQUE KEY un_org_app_org_no (org_no, category),
  UNIQUE KEY un_org_app_app_code (app_code, belong_to_org),
  KEY idx_org_app_belong_to_org (belong_to_org)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='org下面的app配置 一个org下面会有多个app';
 
-- ALTER TABLE score_mall_new.pp_org_app DROP INDEX un_org_app_org_no;  -- 删除有问题的索引
-- ALTER TABLE score_mall_new.pp_org_app ADD `app_code` varchar(30) NOT NULL COMMENT 'app code org下唯一app代号' AFTER category; -- 加app_code 字段
-- CREATE UNIQUE INDEX un_org_app_app_code USING BTREE ON score_mall_new.pp_org_app (app_code,belong_to_org); -- app_code加索引
-- ALTER TABLE score_mall_new.pp_org_app ADD `type` varchar(30) NOT NULL COMMENT '类型 区分app是否具有管理平台和操作员' AFTER app_code; -- 加type 字段
 
/*初始化 APP域名 */
drop table if exists score_mall_new.pp_org_app_domain;
CREATE TABLE score_mall_new.pp_org_app_domain
(
  id         bigint(20)  NOT NULL AUTO_INCREMENT,
  app_no     varchar(30) NOT NULL COMMENT 'app号',
  domain     varchar(180) NOT NULL COMMENT '域名',
  created_at datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`     varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY un_app_domain_domain (domain)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='app配置多个app域名';


/*初始化 组织配置 */
drop table if exists score_mall_new.pp_org_config;
CREATE TABLE score_mall_new.pp_org_config
(
  id            bigint(20)  NOT NULL AUTO_INCREMENT,
  org_no        varchar(30) NOT NULL COMMENT '组织号 全局唯一， 全局第一个组织是根,规则 固定 XX000000000000000000 20位',
  category      varchar(30)          DEFAULT '' COMMENT '分类',
  `key`         varchar(100)         DEFAULT NULL COMMENT 'key',
  `value`         text               COMMENT 'value',
  `desc`          text               COMMENT '描述',
  created_at    datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at    datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`        varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY un_key (org_no, category, `key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='org配置';
 
-- ALTER TABLE score_mall_new.pp_org_config ADD `desc` text COMMENT '描述' AFTER value;

/*初始化 app配置 */
drop table if exists score_mall_new.pp_app_config;
CREATE TABLE score_mall_new.pp_app_config
(
  id            bigint(20)  NOT NULL auto_increment,
  app_no        varchar(30) NOT NULL COMMENT '应用号',
  category      varchar(30)          DEFAULT '' COMMENT '分类',
  `key`           varchar(100)         DEFAULT '' COMMENT 'key',
  `value`         text                 COMMENT 'value',
  `desc`          text                 COMMENT '描述',
  created_at    datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at    datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`        varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY un_key (app_no, category, `key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='app配置';

/*初始化 操作员 */
drop table if exists score_mall_new.pp_operator;
CREATE TABLE score_mall_new.pp_operator
(
  id                  bigint(20)  NOT NULL AUTO_INCREMENT,
  operator_no         varchar(30) NOT NULL COMMENT '用户号 全局唯一 固定 OP000000000000000000 20位',
  belong_to_org       varchar(30) NOT NULL COMMENT '直属组织号上下级关系，eg.因为推荐形成的组织关系',
  own_to_org          varchar(30)          DEFAULT '' COMMENT '归属的组织, 一般用作夸组织的关系',
  app_no              varchar(30) NOT NULL COMMENT 'app no',
  role_no             varchar(30) NOT NULL COMMENT '角色号',
  user_name           varchar(50) NOT NULL COMMENT '用户名非空全局唯一',
  mobile              varchar(50)          DEFAULT '' COMMENT '可空 全局唯一',
  email               varchar(80)          DEFAULT '' COMMENT '可空 全局唯一',
  nick_name           varchar(80)          DEFAULT '' COMMENT '可空 全局唯一',
  otp_key             varchar(80)          DEFAULT '' COMMENT '动态口令码密钥',
  `password`            varchar(80)          DEFAULT '' COMMENT '登录密码',
  register_ip         varchar(50)          DEFAULT '' COMMENT '注册时ip',
  last_login_ip       varchar(50)          DEFAULT '' COMMENT '上一次登录ip',
  lock_status         varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 lock:锁定 锁定状态不能登录',
  login_max_err_times smallint(6)          DEFAULT 5 COMMENT '最大错误登录次数',
  login_err_times     smallint(6)          DEFAULT 0 COMMENT '错误登录次数',
  `creator_name` 	varchar(30) NOT NULL COMMENT '创建人',
  created_at          datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at          datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`              varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY u_idx_operator_operator_no (operator_no),
  KEY idx_operator_status (status),
  KEY idx_operator_user_name (user_name),
  KEY idx_operator_belong_to_org (belong_to_org),
  KEY idx_operator_own_to_org (own_to_org),
  KEY idx_operator_app_no (app_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='操作员';

-- ALTER TABLE score_mall_new.pp_operator ADD `creator_name` varchar(30) NOT NULL COMMENT '创建人' AFTER login_err_times;


/*初始化 角色 */
drop table if exists score_mall_new.pp_role;
CREATE TABLE score_mall_new.pp_role
(
  id         bigint(20)  NOT NULL AUTO_INCREMENT,
  role_no    varchar(30) NOT NULL COMMENT '角色号 全局唯一 RO000000000000000000 20位',
  parent     varchar(30) NOT NULL COMMENT '父亲角色编号',
  org_no        varchar(30) NOT NULL COMMENT '组织号 全局唯一， 全局第一个组织是根,规则 固定 XX000000000000000000 20位',
  app_no     varchar(30) NOT NULL COMMENT 'app no',
  `name`       varchar(60) NOT NULL COMMENT '角色显示名称',
  `desc`     varchar(60)          DEFAULT '' COMMENT '角色描述',
  `level`      smallint(6)          DEFAULT 0 COMMENT '角色层级',
  `creator_name` varchar(30) NOT NULL COMMENT '创建人',
  created_at datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`     varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY un_role_role_no (role_no),
  KEY idx_role_app_no (app_no),
  KEY idx_role_org_no (org_no),
  KEY idx_role_parent (parent),
  KEY idx_role_status (status)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='角色';

-- ALTER TABLE score_mall_new.pp_role ADD `creator_name` varchar(30) NOT NULL COMMENT '创建人' AFTER level;

/*初始化 菜单资源 */
drop table if exists score_mall_new.pp_menu_resource;
CREATE table if not exists score_mall_new.pp_menu_resource (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  resource_code varchar(30) NOT NULL COMMENT '资源编号 全局唯一 英文',
  `type` varchar(10) NOT NULL COMMENT '资源类型 menu func',
  parent varchar(30) NOT NULL DEFAULT '' COMMENT '父资源编号',
  action_type varchar(10) NOT NULL DEFAULT 'link' COMMENT 'link 表示资源的动作连接',
  action_params varchar(100) NOT NULL DEFAULT '' COMMENT '资源行为 路径，事件, 参数等',
  resource_url varchar(512) NOT NULL DEFAULT '' COMMENT '资源url 通常是页面js',
  `name` varchar(60) NOT NULL COMMENT '资源的显示名字',
  `desc` varchar(60) NOT NULL DEFAULT '' COMMENT '资源描述',
  `priority` smallint(6) NOT NULL DEFAULT 0 COMMENT '资源优先级 越大排在越后面',
  icon varchar(30) NOT NULL DEFAULT '' COMMENT '资源的icon',
  default_is_selected varchar(2) NOT NULL DEFAULT 'N' COMMENT '资源是否默认被选中',
  created_at datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY u_idx_resource_code (resource_code)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COMMENT='资源';


/*初始化 角色权限 */
drop table if exists score_mall_new.pp_role_permission;
CREATE TABLE score_mall_new.pp_role_permission
(
  id            bigint(20)  NOT NULL AUTO_INCREMENT,
  resource_code varchar(30) NOT NULL COMMENT '资源编号',
  role_no       varchar(30) NOT NULL COMMENT '角色号',
  org_no        varchar(30) NOT NULL COMMENT '组织号 全局唯一， 全局第一个组织是根,规则 固定 XX000000000000000000 20位',
  app_no        varchar(30) NOT NULL DEFAULT '',
  created_at    datetime             DEFAULT current_timestamp() COMMENT '创建时间',
  updated_at    datetime             DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '上次更新时间',
  `status`      varchar(10) NOT NULL DEFAULT 'normal' COMMENT 'normal:正常 disabled:关闭',
  PRIMARY KEY (id),
  UNIQUE KEY un_role_permission_role_no (resource_code, role_no),
  KEY idx_role_permission_org_no (org_no),
  KEY idx_role_permission_app_no (app_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='权限';


/*初始化 操作日志 */
-- http request
-- http://domain/{user}/{add}
-- http://domain/{action_group}/{action}
drop table if exists score_mall_new.pp_operation_log;
CREATE table if not exists score_mall_new.pp_operation_log
(
    id bigint(20)  NOT NULL AUTO_INCREMENT,
    app_no varchar(30) NOT NULL COMMENT 'app no',
    operator_name varchar(100) DEFAULT '' COMMENT '操作员名字',
    operator_ip varchar(50) DEFAULT '' COMMENT '操作员人 IP',
    session_token varchar(150) DEFAULT '' COMMENT '登录的唯一凭证',
    action_group varchar(30) DEFAULT '' COMMENT '操作分类，例如：填写模块名称',
    action_group_name varchar(50) DEFAULT '' COMMENT '操作分类名称，例如：填写模块名称中文名称',
    `action` varchar(100) DEFAULT '' COMMENT '操作动作',
    action_name varchar(100) DEFAULT '' COMMENT '操作动作名称',
    action_request_params varchar(500) DEFAULT '' COMMENT '请求参数',
    action_result_params text COMMENT '请求结果数据',
    action_result_msg varchar(200) DEFAULT '' COMMENT '请求结果',
    security_level varchar(10) DEFAULT 'normal' COMMENT '操作危险级别 normal 一般查询或非核心修改等无害类，middle 变更类为，high 涉及密钥和资金的操作为 danger 少用',
    created_at datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY idx_action_group (`action_group`),
    KEY idx_app_no (`app_no`)
) ENGINE = InnoDB CHARACTER SET = utf8mb4  COMMENT='操作日志';


/**************************初始化表数据****************************/

-- 创建hm组织/zm平台

/*初始化org*/
INSERT INTO `score_mall_new`.`pp_org`
(`org_no`, `belong_to_org`, `own_to_org`, `name`, `nick_name`, `desc`, `mobile`, `email`, `website`, `type`, `level`, `max_level`, `creator_create_type`, `creator_name`)
VALUES
('OG000000000809997374', 'OG000000000809997374', 'OG000000000809997374', '组织', '组织', '组织描述...', '', '', '', 'root', 1, 8, '', 'system'),
('PL000000001805016656', 'OG000000000809997374', 'OG000000000809997374', '平台', '平台', '平台描述...', '', '', '', 'platform', 2, 8, '', 'admin');

-- update score_mall_new.pp_org set name = '组织', nick_name = '组织', `desc` = '组织描述...' where org_no = 'OG000000000809997374';

/*初始化org config*/
-- INSERT INTO `score_mall_new`.`pp_org_config`
-- (`org_no`, `category`, `key`, `value`)
-- VALUES
-- ('PL000000001805016656', '', '', ''),



-- ==============================================================PL000000001805016656===================AP000000001611384705==========================================

/*初始化org app*/
INSERT INTO `score_mall_new`.`pp_org_app`
( `app_no`,`org_no`, `belong_to_org`, `category`, `app_code`, `type`, `name`, `logo`, `desc`,`theme`, `icp`, `app_info`)
VALUES
('AP000000001611384705','PL000000001805016656', 'PL000000001805016656', 'root','boss','boss','积分商城管理平台', '', 'desc..', 'default', '', '{}' ); /*这里配置app信息和名称，logo是URL*/

UPDATE score_mall_new.pp_org_app set logo = 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3754322468,1709809472&fm=26&gp=0.jpg' where app_no = 'AP000000001611384705' ;

/*初始化org app domain*/
INSERT INTO `score_mall_new`.`pp_org_app_domain`
(`app_no`, `domain`)
VALUES
('AP000000001611384705', 'localhost:8080'), /*这里配置域名映射，可配置多条*/
('AP000000001611384705', 'mall-boss.dev.ptjxd.com'); /*dev*/


/*初始化app config*/
INSERT INTO `score_mall_new`.`pp_app_config`
(`app_no`, `category`, `key`, `value`)
VALUES
-- ('AP000000001611384705', 'sms', 'appId', 'AD-0ff4i67'), /*这里改自己的短信密钥及模版*/
-- ('AP000000001611384705', 'sms', 'appKey', 'AK-e0f1j9a9a9xydzvnqeuf8l6db6q160sul'),
-- ('AP000000001611384705', 'sms', 'templateNo', 'scoreMall'),
('AP000000001611384705', 'system', 'isImageCaptcha', '1'),
('AP000000001611384705', 'system', 'isSms', '1'),
('AP000000001611384705', 'system', 'isOtp', '1');

UPDATE score_mall_new.pp_app_config set value = '0' where `key` = 'isSms';
-- UPDATE score_mall_new.pp_app_config set value = '0' where `key` = 'isImageCaptcha';


/*初始化operator  账户 admin  密码 admin1! */
INSERT INTO `score_mall_new`.`pp_operator`
(`operator_no`, `belong_to_org`, `own_to_org`, `role_no`, `app_no`, `user_name`, `mobile`, `email`, `nick_name`, `otp_key`, `password`, `register_ip`, `last_login_ip`, `lock_status`, `login_max_err_times`, `login_err_times`, `creator_name`)
VALUES
('OP000000000075847600', 'PL000000001805016656', 'PL000000001805016656', 'RO000000000465675274', 'AP000000001611384705', 'admin', '13800138000', '', '超级管理员', '', '8cb08622a46d5800f0f332fb55b8c553', '192.168.1.12', '127.0.0.1', 'normal', 5, 0, 'system');

-- UPDATE score_mall_new.pp_operator set otp_key = 'dev' where operator_no = 'OP000000000075847600';

/*初始化role*/
INSERT INTO `score_mall_new`.`pp_role`( `role_no`, `parent`, `org_no`, `app_no`, `name`, `desc`, `level`, `status`, `creator_name`) 
VALUES ('RO000000000465675274', '', 'PL000000001805016656', 'AP000000001611384705', '管理员', '管理员', 0, 'normal', 'system');



/*初始化menu resource 菜单资源*/

/*基础菜单*/
INSERT INTO `score_mall_new`.`pp_menu_resource`
(`resource_code`, `type`, `parent`, `action_type`, `action_params`, `name`, `desc`, `priority`, `icon`)
VALUES
( 'root', 'menu', '', 'link', '', '根菜单', '根菜单', 0, '');

-- -----------------------------------------------------------------------------------------

/*一级*/
INSERT INTO `score_mall_new`.`pp_menu_resource`
(`resource_code`, `type`, `parent`, `action_type`, `action_params`, `name`, `desc`, `priority`, `icon`)
VALUES
( 'setting', 'menu', 'root', 'link', '', '系统设置', '', 9000, 'setting-o'),

( 'securityCenter', 'menu', 'setting', 'link', 'securityCenter', '安全中心', '', 15, ''),
( 'roleManager', 'menu', 'setting', 'link', 'roleManager', '角色管理', '', 17, ''),
( 'operatorManager', 'menu', 'setting', 'link', 'operatorManager', '操作员管理', '', 18, ''),
-- ( 'orgManager', 'menu', 'setting', 'link', 'orgManager', '组织管理', '', 0, ''),
-- ( 'appManager', 'menu', 'setting', 'link', 'appManager', '应用管理', '', 0, ''),
-- ( 'timingTask', 'menu', 'setting', 'link', 'timingTask', '定时任务', '', 16, ''),
-- ( 'menuManager', 'menu', 'setting', 'link', 'menuManager', '菜单管理', '', 14, ''),
( 'appDictSet', 'menu', 'setting', 'link', 'appDictSet', '应用字典设置', '', 18, '');
-- ( 'appsDictSet', 'menu', 'setting', 'link', 'appsDictSet', '应用字典设置', '', 18, ''),
-- ( 'orgDictSet', 'menu', 'setting', 'link', 'orgDictSet', '业务字典设置', '', 19, ''),
-- ( 'systemParamsSet', 'menu', 'setting', 'link', 'systemParamsSet', '系统参数设置', '', 20, '');

/*一级*/
INSERT INTO `score_mall_new`.`pp_menu_resource`
(`resource_code`, `type`, `parent`, `action_type`, `action_params`, `name`, `desc`, `priority`, `icon`)
VALUES
( 'securityLog', 'menu', 'root', 'link', '', '安全日志', '', 9001, 'shield-o'),

( 'operationLog', 'menu', 'securityLog', 'link', 'operationLog', '操作日志', '', 0, '');


/*初始化role permission*/

/*基础权限*/
INSERT INTO `score_mall_new`.`pp_role_permission`
( `resource_code`, `role_no`, `app_no`,`org_no` )
VALUES
('root', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),

('setting', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
('securityCenter', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
('roleManager', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
('operatorManager', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
('securityLog', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
('operationLog', 'RO000000000465675274','AP000000001611384705','PL000000001805016656');
-- ('appDictSet', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
-- ('appsDictSet', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
-- ('orgDictSet', 'RO000000000465675274','AP000000001611384705','PL000000001805016656');




-- 业务菜单

/*一级*/
INSERT INTO `score_mall_new`.`pp_menu_resource`
(`resource_code`, `type`, `parent`, `action_type`, `action_params`, `name`, `desc`, `priority`, `icon`)
VALUES
( 'shop', 'menu', 'root', 'link', '', '店铺', '', 999, 'storage-o'),

( 'shopManager', 'menu', 'shop', 'link', 'shopManager', '店铺管理', '', 18, ''),
( 'goodsManager', 'menu', 'shop', 'link', 'goodsManager', '商品管理', '', 19, ''),
( 'tradeManager', 'menu', 'shop', 'link', 'tradeManager', '交易管理', '', 20, ''),
( 'bulkDelivery', 'menu', 'shop', 'link', 'bulkDelivery', '批量发货', '', 21, '');

/*一级*/
INSERT INTO `score_mall_new`.`pp_menu_resource`
(`resource_code`, `type`, `parent`, `action_type`, `action_params`, `name`, `desc`, `priority`, `icon`)
VALUES
( 'Account', 'menu', 'root', 'link', '', '账务', '', 1000, 'storage-o'),

( 'shareProfitManager', 'menu', 'Account', 'link', 'shareProfitManager', '分润管理', '', 20, '');

-- 业务权限

INSERT INTO `score_mall_new`.`pp_role_permission`
( `resource_code`, `role_no`, `app_no`,`org_no` )
VALUES /*权限必须有菜单父级才显示子级*/
-- ('shop', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'), 
-- ('shopManager', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
-- ('goodsManager', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
-- ('Account', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
-- ('shareProfitManager', 'RO000000000465675274','AP000000001611384705','PL000000001805016656'),
('bulkDelivery', 'RO000000000465675274','AP000000001611384705','PL000000001805016656');

