stal##  前端开发规范

### 目录结构

App

-- config webpack配置相关

-- dist 输出目录

-- mock 代替api mock 数据

-- node_modules 模块

-- public 静态文件目录（不被webpack编译, 这里为所依赖的框架环境）

-- src 原代码文件

---- assets 静态文件目录（被webpack编译）

---- components 全局组件目录

---- pages 内部页面组件目录

---- views 框架页面组件目录

---- plugins 运行插件目录

---- utils 全局工具目录

-- .babelrc babel语法转换配置

-- .editorconfig 编辑器约定配置

-- .env.dev 开发环境变量配置

-- .env.mock  模拟环境变量配置

-- .env.production  生产环境变量配置

-- .eslintrc  eslint语法规范配置

-- .gitignore git仓库推送忽略配置

-- .poppyignore poppy项目同步忽略配置

-- mock.js  模拟模式配置

-- package-lock.json  npm版本锁定文件

-- package.json 包配置

-- README.md  项目说明文件

-- build 构建文件

-- vue.config.js 项目配置文件

-- yarn.lock yarn版本锁定文件

### 命名规范

+ 资源类文件 以中划线 '-' 链接名字 如 'login-bg.png'

+ 所有Vuew组件已目录承载逻辑，并对外暴露。目录名以及组件名 已 '-' 链接名字, 注意全局名字污染，以准确适当的名字，命名

+ 全局组件（components）以 '-' 链接名字, 注意全局名字污染，以准确适当的名字，推敲命名

+ View组件 (views)  以 '-' 链接名字

+ Pages组件 (Page)  以 '-' 链接名字。 以个Page 目录内部承载某个 资源的Page集合（如 list， edit，show等）
注意 Page数量巨大，注意全局名字污染，以准确适当的名字，推敲命名

### 最佳实践

+ 尽量少用 utils， 全局长量。 应该尽可能多的利用Vue的 注入，插件机制。 如 '$router.push()', '$appConfig' 等
这样对对于页面对侵入性较小，并方便替换实现

+ 对应大规模，且独立变化页面的前端逻辑，个人认为应该放弃状态管理， 而将逻辑内聚到页面内部

+ 前端不做多环境打包， 即不生成开发环境，测试环境，生产环境的独立打包。 而应该是由它所在的环境动态的注入环境数据

+ 对于Page内的共享组件，需要对代码做提升，封装为服务于该组页面的组件

+ 对于Page间的共享组件，需要对代码做提升，封装为全局的组件

+ 尽可能的站在复用的角度去设计和封装组件，做到逻辑的高内和依赖的聚低耦合。 （欢迎题提交到 https://github.com/ValueFE 联系我）

+ 不要写别人已经写烂的代码。他们就在github上面，善于搜索到他们。



### utlis:

##### 节假日工具:
- 获取工作日若干天后,不包括节假日(2019)
`this.$holiday.getWorkingDateLater(originDate, afterDays, isIncludeToday, dateFormat);`

```
params:
  originDate:原日期
  afterDays:多少天后
  isIncludeToday:是否当天起算
  dateFormat：返回的日期格式
```


##### 验证工具: element UI rules
`this.$verify.$() -> rules.$;`
`this.$verify.rules[attr];`

```
attr;

function类;
  _(_type, _message, isTakeEffect = true) 参数为原生类型
  required(_message, isTakeEffect = true) 必填（tip）
  number(isTakeEffect = true) 数值
  intNumber(isTakeEffect = true) 整数
  mobile(isTakeEffect = true) 手机号
  ip(isTakeEffect = true) ip地址
  url(isTakeEffect = true) url地址
  idCardNum(isTakeEffect = true) 身份证号码(弱验证)
  amount(isTakeEffect = true) 金额
  scale(isTakeEffect = true) 百分比
  length(len, _message, isTakeEffect = true) 位数长度
  range(min = 0, max = 100, isTakeEffect = true) 位数长度范围
  noCn(_message = '不支持中文', isTakeEffect = true) 非中文

  validEndTime(startTime, endTime, refs, isTakeEffect = true) 结束时间不能超过开始时间 refs为所在表单的ref属性值
  validTimeRange(startTime, endTime, rangeDay, isTakeEffect = true) 最大范围不超过rangeDay天


  $(rule, paramA, paramB, paramC) rule参数为字符串,为上面的function, A,B,C依次为上面的参数 

object类;
  noValidator:不验证，直接通过

例:
`
const $ = this.$verify.$;
const formRules = {
  field:[$('required','必选项')],
  ...
}

```

```
<el-form  ... :rules="formRules" ref="refName" >
  <el-form-item prop="field" :rules="[$verify.$('required','必选项')]"> // prop 必须对应相关验证变量
    ...
  </el-form-item>
</el-form>
```

##### 格式化工具:
`this.$formatters[attr]`

```
attr;
  formatDate(time, formatStr = 'YYYY-MM-DD HH:mm:ss') 格式化日期
  formatNum(num) 格式化金额 转换为千位符
  formatMoney(amount, unit = 'YUAN', fixedDigit = 2) 格式化金额 转换为元YUAN/FEN
  enMobileStr(mobile) 手机号转星号
  camelCase(string, symbol = '_') _下划线转驼峰
  objCamelCase(obj) 转换对象的key_下划线转驼峰

```

##### http工具:
`this.$http[attr]`

```
attr;
  post()
  get()
  ...
同axios

```

##### storage工具:
`this.$storage[attr]`

```
attr;
  cookie
    set get del clear
  session
    set get del clear
  local
    set get del clear

```



