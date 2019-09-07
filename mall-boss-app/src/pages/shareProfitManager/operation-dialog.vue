<template>
  <div class="shop-operation-dialog">
    <el-dialog
    :title="分润明细"
    :visible.sync="visible"
    :before-close="close"
    width="530px">
      <el-row>
          <el-card class="center">
            <el-table  :data="dialogData.data" >
              <el-table-column label="分润单号" prop="profitNo"/>
              <el-table-column label="分润用户" prop="pfUserNo" width="105px" />
              <el-table-column label="用户级别" width="80px" prop="pfUserGrade" />
              <el-table-column label="分润金额(元)" width="95px" prop="profitAmt" :formatter="formatMoney"/>
            </el-table>
          </el-card> 
      </el-row>
      <el-row type="flex" justify="center">
        <el-button @click="close" size="medium">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { constants } from 'crypto';

  export default {
    props: {
      visible: Boolean,
      dialogData: { default: {} },
    },
    methods: {
      formatMoney(row, col, val, index) { //格式化金额
        if(!val) return '0';
        return this.$formatters.formatMoney(val);
      },
      close () {
        this.$emit('update:visible', false);
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
