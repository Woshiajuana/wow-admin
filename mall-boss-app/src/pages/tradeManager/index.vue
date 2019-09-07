<template>
  <div class="trade-manager">
    <operation-dialog ref="operationDialog" :visible.sync="dialogVisible" :injectData="dialogData" @submit="reqTradeList" />
      <!-- <filter-view
        @filter="reqTradeList"
        @download="doDownloadFile"
        @selectPlatform="selectType('platform')"
        @templateDownload="templateDownload"
        :form-data="objInput"
        :button-data="operateData"
      ></filter-view> -->
    <el-row class="search-box gap">
      <el-card>
        <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item prop="goodsName">
              <el-input v-model.trim="searchForm.goodsName" clearable placeholder="请输入商品名"  style = 'width: 180px; margin-right: 5px;'/>
            </el-form-item>
            <el-form-item prop="platformNo">
              <el-select v-model="searchForm.platformNo" clearable placeholder='请选择所属平台' style='width: 160px; margin-right: 5px;'
                @change="selectType('platform')">
                <el-option
                    v-for="item in this.platformNoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="shopNo">
              <el-select v-model="searchForm.shopNo" clearable placeholder='请选择所属店铺' style='width: 200px; margin-right: 5px;'>
                <el-option
                    v-for="item in this.shopNoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderStatus">
              <el-select v-model="searchForm.orderStatus" clearable placeholder='请选择订单状态' style='width: 160px; margin-right: 5px;'>
                <el-option
                    v-for="item in this.statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          <el-form-item >
            <pp-date-picker
              v-model="searchDate"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" 
              :searchTime.sync="searchForm"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="reqTradeList" icon="el-icon-search" type="primary" :loading="loading">查询</el-button>
            <el-button @click="doDownloadFile" type="success" :loading="loading" icon="el-icon-download">导出</el-button>
            <el-button @click="templateDownload" type="success" :loading="loading" icon="el-icon-download">模板下载</el-button>
          <pp-upload :config="uploadConfig"
            :option="{
              desc: '导入',
              require: true,
              limitSize: 2,
              suffix: ['xlsx'],
              success: uploadSuccess,
              error: uploadError,
              mode: 'button',
            }"
            style="float: right;margin-left:10px"
            v-model="uploadResult"
            :disabled="false" size="big" type="file">
          </pp-upload>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <el-card class="center">
      <table-list @search="reqTradeList" :listData="listData" :listQuery="listQuery" :loading="loading" >
        <el-table-column label="店铺名称" prop="shopName"/>
        <el-table-column label="商品名称" prop="goodsName"/>
        <el-table-column label="订单号" prop="orderNo" width="120"/>
        <el-table-column label="商品数量" prop="tradeBuyNum" width="50"/>  
        <el-table-column label="商品规格" prop="goodsNorms" width="65"/>  
        <el-table-column label="折前价格(元)" prop="goodsPrice" :formatter="formatMoney" />
        <el-table-column label="折后价格(元)" prop="goodsDiscountPrice" :formatter="formatMoney" />
        <el-table-column label="积分抵扣" >
          <template slot-scope="scope">
            {{scope.row.tradePoints || '0' }} 
          </template>
        </el-table-column>
        <el-table-column label="交易金额(元)" prop="tradeAmt" :formatter="formatMoney" />
        <el-table-column label="创建时间" prop="createTime" :formatter="formatDate"/>
        <el-table-column label="付款时间" prop="channelPayTime" :formatter="formatDate"/>
        <el-table-column label="状态" width="60">
          <template slot-scope="scope">
            {{statusOptions[scope.row.orderStatus-1].label}}
          </template>
        </el-table-column>
        <el-table-column label="用户手机号" prop="userPhone" />
        <el-table-column label="收货人姓名" prop="contactName"/>
        <el-table-column label="收货人省份" prop="province"/>
        <el-table-column label="收货人城市" prop="city"/>
        <el-table-column label="收货人区县" prop="county"/>
        <el-table-column label="收货人地址" prop="contactAddress" width="140"/>
        <el-table-column label="发货信息" prop="fastInfo" width="150"/>
        <el-table-column label="操作" fixed="right" width="70" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="open('detail',scope.row, scope.$index)" >详情</el-button>
          </template>
        </el-table-column>
      </table-list>
    </el-card>
  </div>
</template>
<script>
import operationDialog                  from './operation-dialog.vue'
import DataMixin                        from './data.mixin'
import FilterView                       from '@/components/filter-view'
import Verify                           from '@/utils/verify.util'

export default {
  mixins:[
    DataMixin,
  ],
  data(){
    return {
      uploadConfig: {
        action: this.$appConfig.baseURL + this.$appConst.expressImport,
          headers: {
          'access-token': this.$session.get('access-token'),
        },
        takeValueKey: 'publicUrl',
      },
      uploadResult: '',
    }
  },
  components:{
    operationDialog,
    FilterView,
  },
  computed: {},
  created() {
    this.reqTradeList();
    this.getPlatformArr();
    this.getShopArr();
  },
  mounted(){
  },
  methods: {
    formatDate(row, col, val, index) { //格式化日期
      if(!val) return '';
      return this.$formatters.formatDate(val);
    },
    formatMoney(row, col, val, index) { //格式化金额
      if(!val) return '';
      return this.$formatters.formatMoney(val);
    },

    open(type = '', row = {}, index = '', ) {  //详情页面
      const data = JSON.parse(JSON.stringify(row));
      data.orderStatusName = this.statusOptions[data.orderStatus-1].label;
      this.dialogVisible = !this.dialogVisible;
      data.createTime = this.$formatters.formatDate(data.createTime);
      this.dialogData = { type, data, index };
    },

    reqTradeList (callback) {   //查询交易订单信息
      let type = typeof callback === 'function';
      if (type) this.listQuery.pageNum = 1;
      this.listQuery.pageNum = this.listQuery.pageNo;
      let options = Verify.input(this.searchForm);

      let [ startTime, endTime ] = this.searchDate || [];
      if(startTime){
        startTime = this.$formatters.formatDate(startTime, 'YYYY-MM-DD');
        endTime = this.$formatters.formatDate(endTime, 'YYYY-MM-DD');
      };
      let tableData = [];
      this.loading = true;
      this.$http.post(this.$appConst.reqOrderList, {
        ...this.listQuery,
        ...this.searchForm,
        startTime,
        endTime,
      }).then((res) => {
        let {respMessage, respCode, data} = res || {};
        if (respCode !== 'S0001') throw respMessage;
        data = data || {};
        let {list, total} = data;
        this.listQuery.total = total || 0;
        tableData = list || [];
        if (!tableData.length) throw '亲~没有查询到数据哦...';
      }).toast().finally(() => {
        this.listData = tableData;
        setTimeout(() => this.loading = false, 200);
        type && callback();
      });
    },

    doDownloadFile(callback){//导出数据

      let [ startTime, endTime ] = this.searchDate || [];
      let params = '&goodsName='+this.searchForm.goodsName + '&platformNo='+this.searchForm.platformNo +'&shopNo='+this.searchForm.shopNo +'&orderStatus='+this.searchForm.orderStatus;
      
      if(startTime){
        startTime = this.$formatters.formatDate(startTime, 'YYYY-MM-DD');
        endTime = this.$formatters.formatDate(endTime, 'YYYY-MM-DD');
        params += '&startTime='+ startTime +'&endTime=' + endTime;
      }
      const accessToken = sessionStorage.getItem('access-token');
      window.open(this.$appConfig.baseURL + this.$appConst.reqOrderList+'?export=true'+params + '&access_token=' + accessToken);
      typeof callback === 'function' && callback();
    },
    // 模版下载
    templateDownload() {
      const apiUrl = this.$appConfig.baseURL;
      const basic = apiUrl.substr(0, apiUrl.length - 4);
      const url = basic + '/public/template/批量导入模版1.0.xlsx';
      window.open(url);
    },
    async exportExcel(){
      window.open(this.$appConfig.baseURL + this.$appConst.reqOrderList + '?export=true');
    },
    uploadSuccess(res){
      if(res.respCode === 'S0001') {
        if(res.data && res.data != ''){
          this.$message.success(res.data);
        }else{
          this.$message.success('导入成功！');
        }
        return;
      }
      this.$message.error(res.respMessage);
    },
    uploadError(err){
      const error = JSON.parse(err.message);
      this.$message.error(error.respMessage);
    },
    getPlatformArr () { // 获取平台列表
      this.$http.post(this.$appConst.reqEnumShop + 'platform', {
      }).then((res) => {
        let {respMessage, respCode, data} = res || {};
        if(respCode === 'S0001'){
          this.platformNoOptions = data;
        }
      });
    },

    getShopArr (platformNo) { // 获取店铺列表
       this.$http.post(this.$appConst.reqEnumShop + 'shop', {
         platformNo,
       }).then((res) => {
         let {respMessage, respCode, data} = res || {};

         if(respCode === 'S0001'){
           this.shopNoOptions = data;
           this.searchForm.shopNo = '';
         }
       });
    },
    
    selectType(type){  //选择平台获取店铺列表
      let platformNo = this.searchForm.platformNo;
      if(type == 'platform'){
        this.getShopArr(platformNo);
      }
    },

  },
};
</script>
<style lang="stylus">
  .trade-manager{
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