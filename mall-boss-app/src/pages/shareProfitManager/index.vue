<template>
  <div class="profit-manager">
    <operation-dialog :visible.sync="dialogVisible" :dialog-data="dialogData"  />
      <filter-view
        @filter="reqProfitList"
        @selectPlatform="selectType('platform')"
        @download="doDownloadFile"
        :form-data="objInput"
        :button-data="operateData"
      ></filter-view>
    <el-card class="center">
      <table-list @search="reqProfitList" :listData="listData" :listQuery="listQuery" :loading="loading" >
        <el-table-column label="交易订单号" prop="orderNo"/>
        <el-table-column label="店铺名称" prop="shopName"/>
        <el-table-column label="商品名称" prop="goodsName"/>
        <el-table-column label="用户编号" prop="userNo"/>
        <el-table-column label="用户手机号" prop="userPhone"/>
        <el-table-column label="创建时间" prop="createTime" :formatter="formatDate"/>
        <el-table-column label="付款时间" prop="channelPayTime" :formatter="formatDate"/>
        <el-table-column label="总分润金额(元)" prop="shareProfitAmt" :formatter="formatMoney" width="80"/>
        <el-table-column label="操作" fixed="right" width="90" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="open(scope.row.orderNo)" >分润详情</el-button>
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
  components:{
    operationDialog,
    FilterView,
  },
  computed: {},
  created() {
    this.reqProfitList();
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

    open(item) {  //详情页面
      let orderNo = item;
      this.$http.post(this.$appConst.reqProfitList,{
          orderNo,
      }).then((res) =>{
        let {respMessage, respCode, data} = res || {};
        if(respCode === 'S0001'){
          this.dialogVisible = !this.dialogVisible;
          this.dialogData.data = data || [];
        }else{
          throw respMessage;
        }
      });
    },

    reqProfitList (callback) {   //查询交易订单信息
      let type = typeof callback === 'function';
      if (type) this.listQuery.pageNum = 1;
      this.listQuery.pageNum = this.listQuery.pageNo;
      let options = Verify.input(this.objInput);
      let [ startTime, endTime ] = this.objInput.date.value || [];
      if(startTime){
        startTime = this.$formatters.formatDate(startTime, 'YYYY-MM-DD');
        endTime = this.$formatters.formatDate(endTime, 'YYYY-MM-DD');
      };
      let orderStatus = '3,5';
      let tableData = [];
      this.loading = true;
      this.$http.post(this.$appConst.reqOrderList, {
        ...this.listQuery,
        ...options,
        orderStatus,
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

      let options = Verify.input(this.objInput);
      let [ startTime, endTime ] = this.objInput.date.value || [];
      let params = '&orderNo='+options.orderNo + '&userPhone='+options.userPhone + '&platformNo='+options.platformNo + '&shopNo=' + options.shopNo;
      
      if(startTime){
        startTime = this.$formatters.formatDate(startTime, 'YYYY-MM-DD');
        endTime = this.$formatters.formatDate(endTime, 'YYYY-MM-DD');
        params += '&startTime='+ startTime +'&endTime=' + endTime;
      }
      const accessToken = sessionStorage.getItem('access-token');
      window.open(this.$appConfig.baseURL + this.$appConst.reqProfitList+'?export=true'+params + '&access_token=' + accessToken);
      callback();
    },

    getPlatformArr () { // 获取平台列表
      this.$http.post(this.$appConst.reqEnumShop + 'platform', {
      }).then((res) => {
        let {respMessage, respCode, data} = res || {};
        if(respCode === 'S0001'){
          this.objInput.platformNo.options = data;
        }
      });
    },

    getShopArr (platformNo) { // 获取店铺列表
       this.$http.post(this.$appConst.reqEnumShop + 'shop', {
         platformNo,
       }).then((res) => {
         let {respMessage, respCode, data} = res || {};

         if(respCode === 'S0001'){
           this.objInput.shopNo.options = data;
           this.objInput.shopNo.value = '';
         }
       });
    },
    
    selectType(type){  //选择平台获取店铺列表
      let platformNo = this.objInput.platformNo.value;
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