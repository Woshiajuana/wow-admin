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