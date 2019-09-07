<template>
  <div class="goods-manager">
    <operation-dialog ref="operationDialog" :visible.sync="dialogVisible" :injectData="dialogData" @submit="reqGoodsList()" />
      <filter-view
        @add="open('new')"
        @selectPlatform="selectType('platform')"
        @selectShop="selectType('shop')"
        @filter="reqGoodsList"
        :form-data="objInput"
        :button-data="operateData"
      ></filter-view>
    <el-card class="center">
      <table-list @search="reqGoodsList" :listData="listData" :listQuery="listQuery" :loading="loading">
        <el-table-column label="店铺名称" prop="shopName"/>
        <el-table-column label="商品标题" prop="goodsName"/>
        <el-table-column label="积分价格" prop="discountPoints"/>
        <el-table-column label="RMB价格(元)" prop="paymentPrice" :formatter="formatMoney"/>
        <el-table-column label="分润金额(元)" prop="shareAmount" :formatter="formatMoney"/>
        <el-table-column label="库存数量" prop="goodsStockNum" width="60"/>
        <el-table-column label="抢购开始时间" prop="startTime" :formatter="formatDate"/>
        <el-table-column label="抢购结束时间" prop="endTime" :formatter="formatDate"/>
        <el-table-column label="更新时间" prop="updateTime" :formatter="formatDate"/>
        <el-table-column label="商品图片" prop="thumbnailPath"  width="55">
          <template slot-scope="scope">
            <img style="width: 30px; height: 30px" :src="scope.row.thumbnailPath"></img>
          </template>
        </el-table-column>
        <el-table-column label="商品状态" prop="isShelf" :formatter="(row, col ,val) => mapping(val, 'isShelf')" width="50" />
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <el-button type="success" v-if="scope.row.isShelf == 'disabled'" size="mini" @click="updateStatus(scope.row.goodsNo,'normal')" >上架</el-button>
            <el-button type="danger" v-if="scope.row.isShelf == 'normal'" size="mini" @click="updateStatus(scope.row.goodsNo,'disabled')" >下架</el-button>
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
import FilterMixin                      from '@/mixins/filter.mixin'

export default {
  mixins: [
    DataMixin,
    FilterMixin,
  ],
  components:{
    operationDialog,
    FilterView,
  },
  computed: {},
  created() {
    this.reqGoodsList();
    this.getPlatformArr();
    this.getShopArr();
  },
  mounted(){
  },
  methods: {
    formatDate(row, col, val, index) { //格式化日期
      if(!val){
        return '';
      }

      return this.$formatters.formatDate(val);

    },

    formatMoney(row, col, val, index) { //格式化金额
      if(!val){
        return '';
      }
      return this.$formatters.formatMoney(val);
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

    reqGoodsList (callback) {
      let type = typeof callback === 'function';
      if (type) this.listQuery.pageNum = 1;
      this.listQuery.pageNum = this.listQuery.pageNo
      let options = Verify.input(this.objInput);
      let tableData = [];
      this.loading = true;
      this.$http.post(this.$appConst.reqGoodsList, {
        ...this.listQuery,
        ...options,
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

    updateStatus(goodsNo,status){  //上下架切换
      let message = '';
      if(status == 'normal'){
        message = '此操作将商品上架, 是否继续?';
      }else{
        message = '此操作将商品下架, 是否继续?';
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.$appConst.doToggleStatus,{
          goodsNo,
          status,
        }).then((res) =>{
          let {respMessage, respCode, data} = res || {};
          if(respCode === 'S0001'){
            if(status == 'normal'){
              this.$message("商品上架成功");
            }else{
              this.$message("商品下架成功");
            }
            this.reqGoodsList();
          }else{
            this.$message(respMessage);
          }
        });
      }).null();
    },

    open(type = '', row = {}, index = '', ) {//新增、编辑dialog
      const data = JSON.parse(JSON.stringify(row));
      this.dialogVisible = !this.dialogVisible;
      data.platformNum = this.objInput.platformNo.options;
      if(type == 'edit'){
        data.shopNum = this.objInput.shopNo.options;
      }else{
        data.shopNum = [];
      }
      this.dialogData = { type, data, index };
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

    selectType(type){
      let platformNo = this.objInput.platformNo.value;
      if(type == 'shop'){
        // if(platformNo == ''){
        //   this.$message('请先选择所属平台');
        // }
      }else if(type == 'platform'){
        this.getShopArr(platformNo);
      }
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
  },
};
</script>
<style lang="stylus">
  .goods-manager{
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