<template>
  <div class="shop-operation-dialog">
    <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="handleClose"
    width="810px">
      <el-form :model="dialogForm"  ref="dialogForm" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="shopName"  label="店铺名称">
              <el-input v-model.trim="dialogForm.shopName" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="contactName"  label="收货人姓名">
              <el-input v-model.trim="dialogForm.contactName" :disabled="disabled" />
            </el-form-item>
          </el-col> 
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="goodsName"  label="商品名称">
              <el-input v-model.trim="dialogForm.goodsName" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="contactPhone"  label="收货人手机号">
              <el-input v-model.trim="dialogForm.contactPhone" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="orderNo" label="订单号" >
              <el-input v-model.trim="dialogForm.orderNo" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="province" label="收货人省份">
              <el-input v-model.trim="dialogForm.province" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="tradeBuyNum" label="商品数量">
              <el-input v-model.trim="dialogForm.tradeBuyNum" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="city" label="收货人城市">
              <el-input v-model.trim="dialogForm.city" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="goodsPrice" label="折前价格(元)">
              <el-input v-model.trim="dialogForm.goodsPrice" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="county" label="收货人区县">
              <el-input v-model.trim="dialogForm.county" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="goodsDiscountPrice" label="折后价格(元)">
              <el-input v-model.trim="dialogForm.goodsDiscountPrice" :disabled="disabled"  />
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="contactAddress" label="收货人地址">
              <el-input v-model.trim="dialogForm.contactAddress" :disabled="disabled" type="textarea" autosize />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="gtradePoints" label="积分抵扣">
              <el-input v-model.trim="dialogForm.tradePoints || 0" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="fastInfo" label="物流信息">
              <el-input v-model.trim="dialogForm.fastInfo" :disabled="disabled" type="textarea" autosize /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="tradeAmt" label="交易金额(元)">
              <el-input v-model.trim="dialogForm.tradeAmt" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="11" :push="1.0">
            <el-form-item prop="orderStatus" label="订单状态">
              <el-input v-model.trim="dialogForm.orderStatusName" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
          <el-form-item prop="goodsNorms" label="商品规格">
            <el-input v-model.trim="dialogForm.goodsNorms" :disabled="disabled" style="width:42%"/>
          </el-form-item>
          <el-form-item prop="createTime" label="交易创建时间">
            <el-input v-model.trim="dialogForm.createTime" :disabled="disabled" style="width:42%"/>
             <!-- <pp-date-picker v-model="dialogForm.createTime" style="width:47%" :disabled="disabled"/> -->
          </el-form-item>
          <el-form-item prop="channelPayTime" label="付款完成时间">
            <el-input v-model.trim="dialogForm.channelPayTime" :disabled="disabled" style="width:42%"/>
            <!-- <pp-date-picker v-model="dialogForm.channelPayTime" style="width:47%" :disabled="disabled"/> -->
          </el-form-item>
          <el-form-item prop="userPhone" label="用户手机号">
            <el-input v-model.trim="dialogForm.userPhone" :disabled="disabled" style="width:42%" />
          </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="handleClose" size="medium">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
 import cal            from '@/utils/calculation'

  export default {
    props: {
      visible: Boolean,
      injectData: Object,
    },
    data () {
      const $ = this.$verify.$;
      const defaultDialogForm = {
        shopName:'',
      }
      const dialogForm = JSON.parse(JSON.stringify(defaultDialogForm));
      return {
        loading: false,
        title: '',

        defaultDialogForm,
        dialogForm,

        disabled:false,
        allDisabled: false,
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
    },
    methods: {
      handleClose () {
        this.$emit('update:visible', false);
        this.initForm();
      },
      initForm () {
        this.dialogForm = JSON.parse(JSON.stringify(this.defaultDialogForm));
        this.curIndex = '';
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate();
      },
      showMod ({ data, index, type }) {
        this.curIndex = index; // 记录当前修改位置
        this.curType = type; // 记录当前修改位

        if (this.curType === 'new') {
          this.title = "新增店铺";
          this.disabled = false;
        }
        if (this.curType === 'edit') {
          this.dialogForm = data; // 还原当前修改项
          this.title = "编辑店铺";
          this.disabled = true;
        }
        if (this.curType === 'detail') {
          data.goodsPrice = cal.accMul(data.goodsPrice,0.01);
          data.goodsDiscountPrice = cal.accMul(data.goodsDiscountPrice,0.01);
          data.tradeAmt = cal.accMul(data.tradeAmt,0.01);
          this.dialogForm = data; // 注入数据
          this.title = "订单信息";
          this.disabled = true;
        }
      },
    }
  };
</script>

<style>

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
