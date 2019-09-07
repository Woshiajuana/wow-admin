<template>
  <div class="role-manager">
    <operation-dialog ref="operationDialog" :visible.sync="dialogVisible" :injectData="dialogData" @submit="reqShopList()" />
      <filter-view
        @add="open('new')"
        @filter="reqShopList"
        :form-data="objInput"
        :button-data="operateData"
      ></filter-view>
<!--    <el-row class="search-box gap">-->
<!--      <el-card>-->
<!--        <el-form ref="searchForm" :model="searchForm" size="small" :inline="true">-->
<!--          <el-form-item prop="shopName">-->
<!--            <el-input v-model.trim="searchForm.shopName" clearable placeholder="店铺名称" />-->
<!--          </el-form-item>-->
<!--          <el-form-item prop="company">-->
<!--            <el-input v-model.trim="searchForm.company" clearable placeholder="公司名称/商户号" />-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <pp-date-picker-->
<!--              v-model="searchDateRange"-->
<!--              clearable-->
<!--              type="datetimerange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              :searchTime.sync="searchForm"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button @click="search(1)" icon="el-icon-search" type="primary" :loading="loading">搜索</el-button>-->
<!--            <el-button type="primary" size="small" icon="el-icon-plus" @click="open('new')">新增</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-card>-->
<!--    </el-row>-->
<!--    <el-row>-->
<!--      <el-upload-->
<!--        class="upload-demo"-->
<!--        action="http://localhost:17011/api/v1/oss-file/upload"-->
<!--        :on-preview="handlePreview"-->
<!--        :on-remove="handleRemove"-->
<!--        :file-list="fileList"-->
<!--        list-type="picture">-->
<!--        <el-button size="small" type="primary">点击上传</el-button>-->
<!--        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--      </el-upload>-->
<!--    <el-row>-->
<!--      <el-upload-->
<!--        class="upload-demo"-->
<!--        action="http://localhost:17011/api/base/v1/utlis/oss-file/goods"-->
<!--        :on-preview="handlePreview"-->
<!--        :on-remove="handleRemove"-->
<!--        :file-list="fileList"-->
<!--        list-type="picture">-->
<!--        <el-button size="small" type="primary">点击上传</el-button>-->
<!--        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
<!--      </el-upload>-->
<!--    </el-row>-->
<!--    <el-row class="right gap">-->
<!--      <el-button type="success" size="small" icon="el-icon-plus" @click="open('new')">新增店铺</el-button>-->
<!--    </el-row>-->
<!--    <el-row class="search-box gap">-->
<!--      <el-card>-->
<!--        <el-form ref="searchForm" :model="searchForm" size="small" :inline="true">-->
<!--          <el-form-item>-->
<!--            <pp-date-picker-->
<!--              v-model="searchDateRange"-->
<!--              clearable-->
<!--              type="datetimerange"-->
<!--              range-separator="至"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期" -->
<!--              :searchTime.sync="searchForm"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item prop="shopNo">-->
<!--            <el-input v-model.trim="searchForm.shopNo" clearable placeholder="店铺号" />-->
<!--          </el-form-item>-->
<!--          <el-form-item prop="shopName">-->
<!--            <el-input v-model.trim="searchForm.shopName" clearable placeholder="店铺名称" />-->
<!--          </el-form-item>-->
<!--          <el-form-item prop="email">-->
<!--            <el-input v-model.trim="searchForm.email" clearable placeholder="管理员邮箱" />-->
<!--          </el-form-item>-->
<!--          <el-form-item prop="phone">-->
<!--            <el-input v-model.trim="searchForm.phone" clearable placeholder="手机号" />-->
<!--          </el-form-item>-->
<!--          <el-form-item prop="status">-->
<!--            <pp-select v-model="searchForm.status" :eunmData="statusEnum"  placeholder="状态" />-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button @click="search(1)" icon="el-icon-search" type="primary" :loading="loading">搜索</el-button>-->
<!--            <el-button @click="reset" icon="el-icon-close">重置</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </el-card>-->
<!--    </el-row>-->
    <el-card class="center">
      <table-list @search="reqShopList" :listData="listData" :listQuery="listQuery" v-loading="loading">
        <el-table-column label="店铺名称" prop="shopName"/>
        <el-table-column label="所属平台" prop="platformName"/>
        <el-table-column label="公司名称" prop="companyName"/>
        <el-table-column label="支付宝名称" prop="alipayName" width="95"/>
        <el-table-column label="支付宝账户" prop="alipayId" />
<!--        <el-table-column label="支付宝秘钥" prop="alipayPublicKey"/>-->
        <el-table-column label="微信收名称" prop="wechatName" />
        <el-table-column label="微信账户" prop="wechatId"/>
<!--        <el-table-column label="微信秘钥" prop="wechatPublicKey"/>-->
        <el-table-column label="创建时间" prop="createTime" :formatter="formatDate"/>
        <el-table-column label="更新时间" prop="updateTime" :formatter="formatDate"/>
        <el-table-column label="店铺状态" prop="status" :formatter="(row, col ,val) => mapping(val, 'status')" width="70"/>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="danger" v-if="scope.row.status == 'normal'" size="mini" @click="updateStatus(scope.row.shopNo,'disabled')" >停用</el-button>
            <el-button type="primary" v-if="scope.row.status == 'disabled'" size="mini" @click="updateStatus(scope.row.shopNo,'normal')" >启用</el-button>
            <el-button type="primary" size="mini" @click="open('edit',scope.row, scope.$index)" >编辑</el-button>
          </template>
        </el-table-column>
      </table-list>
    </el-card>
  </div>
</template>
<script>
import operationDialog                  from './operation-dialog.vue'
import FilterView                       from '@/components/filter-view'
import DataMixin                        from './data.mixin'
import Verify                           from '@/utils/verify.util'

export default {
  mixins: [
    DataMixin,
  ],
  components:{
    operationDialog,
    FilterView,
  },
  computed: {},
  created() {
     this.reqShopList();
    // this.getPlatformArr();
  },
  mounted(){
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    formatDate(row, col, val, index) { //格式化日期
      return this.$formatters.formatDate(val);
    },
    mapping(val, type){
      const enumData = this.statusEnum;
      let returnVal = '';
      try {
        Object.keys(enumData).forEach(key => {
          if(enumData[key] === val){
            returnVal = key;
            throw Error();
          }
        });
      } catch (error) {}
      return returnVal;
    },
    reset(){
      this.$refs.searchForm && this.$refs.searchForm.resetFields();
      this.searchDateRange = [];
    },
    reqShopList (callback) {
      let type = typeof callback === 'function';
      if (type) this.listQuery.pageNo = 1;
      let options = Verify.input(this.objInput);
      let tableData = [];
      let [ startTime, endTime ] = this.objInput.date.value || [];
      if(startTime){
        startTime = this.$formatters.formatDate(startTime, 'YYYY-MM-DD');
        endTime = this.$formatters.formatDate(endTime, 'YYYY-MM-DD');
      }
      this.loading = true;
      this.$http.post(this.$appConst.reqShopList, {
        ...this.listQuery,
        ...options,
        startTime,
        endTime,
      }).then((res) => {
        let { respMessage, respCode, data } = res || {};
        if (respCode !== 'S0001') throw respMessage;
        data = data || {};
        let { list, total } = data;
        this.listQuery.total = total || 0;
        tableData = list || [];
        if (!tableData.length) throw '亲~没有查询到数据哦...';
      }).toast().finally(() => {
        this.listData = tableData;
        setTimeout(() => this.loading = false, 200);
        type && callback();
      });
    },



    open(type = '', row = {}, index = '', ) {
      const data = JSON.parse(JSON.stringify(row));
      this.dialogVisible = !this.dialogVisible;
      this.dialogData = { type, data, index };
    },
    updateStatus(shopNo,status){
      let message = '';
      if(status == 'normal'){
        message = '店铺启用';
      }else{
        message = '店铺停用';
      }
      this.$confirm('此操作将'+message+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$appConst.doUpdateShopStatus, {
          shopNo,
          status,
        }).then((response) => {
          let { respMessage, respCode } = response || {};
          if (respCode !== 'S0001') throw respMessage;
          this.$message.success(message+'成功!');
          this.reqShopList();
        }).toast();
      }).null();
    },
  },
};
</script>
<style lang="stylus">
  .role-manager{
    .gap {
      margin-bottom: 15px;
    }
    .left{
      text-align:left;
    }
    .right{
      text-align:right;
    }
    .center{
      text-align:center;
    }
  }
</style>