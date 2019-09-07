<template>
  <div class="shop-operation-dialog">
    <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="close"
    width="560px">
      <el-row>
        <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogForm" label-width="110px" size="small">
          <el-form-item prop="shopName"  label="店铺名称">
            <el-input  id="shopName" v-model.trim="dialogForm.shopName" clearable placeholder="请输入店铺全称" maxlength="50" @blur="checkShop" />
          </el-form-item>
          <el-form-item prop="companyName"  label="公司名称">
            <el-input v-model.trim="dialogForm.companyName" clearable placeholder="请输入公司名称全称" maxlength="30" />
          </el-form-item>
          <el-form-item prop="contactsName"  label="联系人">
            <el-input v-model.trim="dialogForm.contactsName" clearable placeholder="请输入店铺联系人" maxlength="11"  />
          </el-form-item>
          <el-form-item prop="contactsPhone"  label="联系电话">
            <el-input v-model.trim="dialogForm.contactsPhone" clearable placeholder="请输入店铺联系电话" maxlength="11" />
          </el-form-item>
          <el-form-item prop="customerPhone" label="客服电话">
            <el-input v-model.trim="dialogForm.customerPhone" clearable placeholder="格式如:40000000088" maxlength="11" />
          </el-form-item>
          <el-form-item prop="status" label="店铺状态">
            <pp-select v-model="dialogForm.status" :eunmData="statusEnum" placeholder="请选择" style="width:30%" />
          </el-form-item>
          <el-form-item prop="platformNo" label="所属平台">
            <el-select v-model="dialogForm.platformNo" placeholder="请选择" @change="fnEdit">
              <el-option
                v-for="item in platformEnum"
                :key="item.platformNo"
                :label="item.platformName"
                :value="item.platformNo">
              </el-option>
            </el-select>
          </el-form-item>
          <h4>收款账户配置</h4>
          <el-form-item prop="alipayName" label="支付宝名称">
            <el-input v-model.trim="dialogForm.alipayName" clearable placeholder="请输入支付宝名称" maxlength="20" />
          </el-form-item>
          <el-form-item prop="alipayId" label="支付宝账号">
            <el-input v-model.trim="dialogForm.alipayId" clearable placeholder="请输入支付宝账号" maxlength="20" />
          </el-form-item>
          <el-form-item prop="alipaySignType" label="签名方式">
            <pp-select v-model="dialogForm.alipaySignType" :eunmData="alipaySignEnum" placeholder="请选择" style="width:30%" />
          </el-form-item>
          <el-form-item prop="alipayPublicKey" label="支付宝公钥">
            <el-input v-model.trim="dialogForm.alipayPublicKey" clearable placeholder="请输入支付宝公钥" type="textarea" />
          </el-form-item>
          <el-form-item prop="alipayPrivateKey" label="支付宝私钥">
            <el-input v-model.trim="dialogForm.alipayPrivateKey" clearable placeholder="请输入支付宝私钥" type="textarea"  />
          </el-form-item>

          <el-form-item prop="weChatName" label="微信名称">
            <el-input v-model.trim="dialogForm.wechatName" clearable placeholder="请输入微信名称" maxlength="20" />
          </el-form-item>
          <el-form-item prop="weChatId" label="微信账号">
            <el-input v-model.trim="dialogForm.wechatId" clearable placeholder="请输入微信账号" maxlength="20" />
          </el-form-item>
          <el-form-item prop="weChatPublicKey" label="微信公钥">
            <el-input v-model.trim="dialogForm.wechatPublicKey" clearable placeholder="请输入微信公钥" type="textarea" />
          </el-form-item>
          <el-form-item prop="weChatPrivateKey" label="微信私钥">
            <el-input v-model.trim="dialogForm.wechatPrivateKey" clearable placeholder="请输入微信私钥" type="textarea" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button @click="submit" size="medium" type="primary" :loading="loading">保存</el-button>
        <el-button @click="close" size="medium">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      visible: Boolean,
      injectData: Object,
    },
    data () {
      const $ = this.$verify.$;
      const defaultDialogForm = {
        shopName:'',
        shopNameOrigin: '',
        companyName:'',
        contactsName:'',
        contactsPhone:'',
        customerPhone:'',
        status:'normal',
        platformName:'',
        alipayId: '',
        alipayName: '',
        alipayPrivateKey: "",
        alipayPublicKey: "",
      }
      const dialogForm = JSON.parse(JSON.stringify(defaultDialogForm));
      var validatorShop = (rule, value, callback) => {  //检核折扣抵扣金额
        if (value !== '') {
          if (this.checkShopName) {
            callback(new Error('店铺已存在，请修改店铺名'));
          }
          callback();
        }
      };
      return {
        loading: false,
        title: '',

        defaultDialogForm,
        dialogForm,
        checkShopName: false,
        dialogFormRules:{
          shopName: [$('required'),{ validator: validatorShop, trigger: 'blur' }],
          companyName: [$('required')],
          contactsName: [$('required')],
          contactsPhone: [$('required'), $('mobile')],
          customerPhone: [$('required'), $('intNumber')],
          status: [$('required')],
          platformNo: [$('required')],
          alipayName: [$('required')],
          alipayId: [$('required')],
          alipayPublicKey: [$('required')],
          alipayPrivateKey: [$('required')],
          alipaySignType: [$('required')],
        },

        disabled:false,
        allDisabled: false,

        platformEnum: [],//所属平台信息
        statusEnum: { // 店铺状态
          '启用': 'normal',
          '停用': 'disabled',
        },

        alipaySignEnum: {  //加密方式
          'MD5': 'MD5',
          'RSA': 'RSA',
          'RSA2': 'RSA2',
        },


      };
    },
    watch:{
      visible (val) {
        if(val){
          this.showMod(this.injectData);
        }
      },
    },
    created(){
      this.getPlatformArr();
    },
    methods: {
      beforeClose () {
        if (this.curType === 'new' || this.curType === 'edit') {
          this.$confirm('变动信息将丢失, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.close();
          });
        } else {
          this.close();
        }
      },
      close () {
        this.$emit('update:visible', false);
        this.initForm();
      },
      initForm () {
        this.dialogForm = JSON.parse(JSON.stringify(this.defaultDialogForm));
        this.checkShopName = false;
        this.curIndex = '';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      verifyData () {
        let verifyResult = true;
        this.$refs.dialogForm && this.$refs.dialogForm.validate( pass => {
          verifyResult = pass
        });
        return verifyResult;
      },
      async submit () {
        let reqUrl = '';
        if (this.curType === 'new') {
          reqUrl = this.$appConst.doAddShopInfo;
        }
        if (this.curType === 'edit') {
          reqUrl = this.$appConst.doUpdateShopInfo;
        }
        if (!this.verifyData()) return null;
        const params = Object.assign({},this.dialogForm);
        const res = await this.$axios(this,{
          verifyForm: "dialogForm",
        }).post(reqUrl, params);
        if (res && res.respCode !== 'S0001') throw res.respMessage;
          this.$message.success('保存成功');
          this.$emit('submit', res);
          this.close();
      },
      async getPlatformArr () { // 获取平台列表
        const res = await this.$axios(this).post(this.$appConst.reqPlatformList);
        if (res && res.respCode === 'S0001') {
          this.platformEnum = res.data;
        }
      },
      fnEdit(platformNo){ //获取所属平台名称
        let obj = {};
        obj = this.platformEnum.find((item) =>{
          return item.platformNo === platformNo;
        });
        this.dialogForm.platformName = obj.platformName;
      },

      checkShop(){   //检核店铺名称是否存在
        let shopName = this.dialogForm.shopName;
        //判断是否存在当前的店铺名
        if(shopName === this.dialogForm.shopNameOrigin){
          return;
        }

        this.$http.post(this.$appConst.doCheckShop, {
          shopName,
        }).then((response) => {
          let { respMessage, respCode } = response || {};
          if (respCode !== 'S0001'){
            this.checkShopName = true;
          }else{
            this.checkShopName = false;
          }

          this.$refs.dialogForm.validateField('shopName', (phoneError) => {

          });
        });
      },

      showMod ({ data, index, type }) {
        this.curIndex = index; // 记录当前修改位置
        this.curType = type; // 记录当前修改位置

        if (this.curType === 'new') {
          this.title = "新增店铺";
          this.allDisabled = false;
          this.disabled = false;
        }
        if (this.curType === 'edit') {
          this.dialogForm = data; // 还原当前修改项
          this.dialogForm.shopNameOrigin = data.shopName;
          this.title = "编辑店铺";
          this.allDisabled = false;
          this.disabled = true;
        }
      },
    }
  };
</script>

<style>

/*间距*/
.shop-operation-dialog h4 {
  font-weight:bold; 
  height:30px;
  line-height:30px;
  color:#444
}
.shop-operation-dialog h4::after{
  content:"";
  border-bottom:1px dashed #ddd; 
  display:block; 
  margin-left:120px; 
  margin-top:-17px
}
.shop-operation-dialog .el-dialog__body {
  overflow: hidden;
  padding: 20px 30px 30px !important;
}
.shop-operation-dialog .el-input.is-disabled .el-input__inner {
  cursor: default; /*输入框禁用鼠标样式为默认*/
  color: #000;
}
.shop-operation-dialog
  .el-select
  .el-input.is-disabled
  .el-input__inner {
  cursor: default; /*选择框禁用鼠标样式为默认*/
}
.shop-operation-dialog .el-input.is-disabled .el-input__icon {
  cursor: default; /*选择框下拉图标禁用鼠标样式为默认*/
}
.shop-operation-dialog
  .el-checkbox__input.is-disabled
  .el-checkbox__inner {
  cursor: default; /*多选框禁用鼠标样式为默认*/
}
.shop-operation-dialog
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
  background-color: #f58628;
  border-color: #f58628;
}
.shop-operation-dialog
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner::after {
  border-color: #fff;
}
.shop-operation-dialog
  .el-checkbox__input.is-disabled
  + span.el-checkbox__label {
  cursor: default; /*多选框标签禁用鼠标样式为默认*/
  color: #000;
}

</style>
