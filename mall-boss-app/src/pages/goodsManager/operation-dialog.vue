<template>
  <div class="shop-operation-dialog">
    <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="close"
    width="800px">
      <el-row>
        <el-form :model="dialogForm" :rules="dialogFormRules" ref="dialogForm" label-width="130px" size="small">
          <el-form-item prop="goodsName"  label="商品标题">
            <el-input v-model.trim="dialogForm.goodsName" clearable placeholder="请输入商品名称" maxlength="30" />
          </el-form-item>
          <el-form-item prop="platformNo" label="所属平台">
            <el-select v-model="dialogForm.platformNo" placeholder="请选择" @change="getShopArr" >
              <el-option v-for="item in platformEnum" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="shopNo" label="所属店铺">
            <el-select v-model="dialogForm.shopNo" placeholder="请选择" >
              <el-option v-for="item in shopEnum" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="goodsPrice"  label="折扣前价格(元)" style="width:44%">
            <el-input v-model="dialogForm.goodsPrice" clearable placeholder="商品原价，仅供展示" maxlength="12" />
          </el-form-item>
          <el-form-item prop="goodsDiscountPrice"  label="折扣后价格(元)" style="width:44%" >
            <el-input v-model="dialogForm.goodsDiscountPrice" clearable placeholder="当前商品售价" maxlength="12" />
          </el-form-item>
          <el-form-item prop="discountPoints"  label="积分最高抵扣(元)" style="width:44%" >
            <el-input v-model="dialogForm.discountPoints" clearable placeholder="单件最多使用积分数量" maxlength="12" />
          </el-form-item>
          <el-form-item prop="paymentPrice" label="RMB价格(元)" style="width:44%" >
            <el-input v-model="paymentPrice" :disabled="true"/>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="shareAmount" label="分润金额(元)" style="width:88%" >
                <el-input v-model="dialogForm.shareAmount"  clearable placeholder="请输入分润金额" maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="0.5">
              <el-form-item prop="goodsSort" label="商品排序" label-width="160px" >
                <el-input v-model="dialogForm.goodsSort"  clearable placeholder="请输入商品排序号" maxlength="10" style="width:115%" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row >
            <el-col :span="12" >
              <el-form-item prop="goodsStockNum" label="库存数量" style="width:88%">
                <el-input v-model.trim="dialogForm.goodsStockNum" clearable placeholder="请输入库存数量" maxlength="10"  />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push = "0.5">
              <el-form-item prop="limitNum" label="单笔订单限购数量" label-width="160px">
                <el-input v-model.trim="dialogForm.limitNum" clearable placeholder="请输入限购数量" maxlength="10" style="width:115%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item prop="goodsNorms" label="商品规格" style="width:88%">
                <el-input v-model.trim="dialogForm.goodsNorms" clearable placeholder="如：S,M,L,XL,XXL" maxlength="60" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push = "0.5">
              <el-form-item prop="onefreightAmount" label="单件运费(元)" label-width="160px">
                <el-input v-model.trim="dialogForm.onefreightAmount" clearable placeholder="请输入单件运费" style="width:115%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item prop="goodsBuyArea" label="上架专区" >
                <pp-select v-model="dialogForm.goodsBuyArea" :eunmData="zoneEnum" placeholder="请选择上架专区" style="width:82%"/>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push = "0.5">
              <el-form-item prop="morefreightAmount" label="多件运费(元)" label-width="160px">
                <el-input v-model.trim="dialogForm.morefreightAmount" clearable placeholder="请输入多件运费" maxlength="10" style="width:115%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <template
            v-if="dialogForm.goodsBuyArea == 2">
            <el-form-item prop="startTime" label="抢购开始时间" style="width:44%" :rules="[$('required'),$('validEndTime',dialogForm.startTime,dialogForm.endTime)]">
              <pp-date-picker v-model="dialogForm.startTime" type="datetime" placeholder="请选择开始时间"/>
            </el-form-item>
            <el-form-item prop="endTime" label="抢购结束时间" style="width:44%" :rules="[$('required'),$('validEndTime',dialogForm.startTime,dialogForm.endTime)]">
              <pp-date-picker v-model="dialogForm.endTime" type="datetime" placeholder="请选择结束时间"/>
            </el-form-item>
          </template>
          <el-form-item prop="isHot" label="是否热门推荐">
            <pp-select v-model="dialogForm.isHot" :eunmData="statusEnum" placeholder="请选择" style="width:20%" />
          </el-form-item>
          <el-form-item prop="thumbnailPath" label="商品缩略图">
            <div class="lable-img" ><span>建议：350*350尺寸2M以下jpeg图</span></div>
            <el-form-item label-width="0" prop="thumbnailImg.img1" class="upload-img">
              <pp-upload :config="thumbnailUploadConfig" :option="{desc:'上传略缩图',require:true,limitSize:2}" v-model="dialogForm.thumbnailImg.img1" :disabled="false" size="small" type="img" />
            </el-form-item>
          </el-form-item>
          <el-form-item prop="wheelPlantingPath" label="商品轮播图" >
            <div class="lable-img"><span>建议：750*690尺寸2M以下jpeg图</span></div>
            <el-form-item label-width="0" prop="wheelPlantingImg.img1" class="upload-img">
              <pp-upload :config="wheelPlantingUploadConfig" :option="{desc:'上传轮播图',require:true,limitSize:2}" v-model="dialogForm.wheelPlantingImg.img1" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="wheelPlantingImg.img2" class="upload-img">
              <pp-upload :config="wheelPlantingUploadConfig" :option="{desc:'上传轮播图',require:false,limitSize:2}" v-model="dialogForm.wheelPlantingImg.img2" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="wheelPlantingImg.img3" class="upload-img">
              <pp-upload :config="wheelPlantingUploadConfig" :option="{desc:'上传轮播图',require:false,limitSize:2}" v-model="dialogForm.wheelPlantingImg.img3" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="wheelPlantingImg.img4" class="upload-img">
              <pp-upload :config="wheelPlantingUploadConfig" :option="{desc:'上传轮播图',require:false,limitSize:2}" v-model="dialogForm.wheelPlantingImg.img4" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="wheelPlantingImg.img5" class="upload-img">
              <pp-upload :config="wheelPlantingUploadConfig" :option="{desc:'上传轮播图',require:false,limitSize:2}" v-model="dialogForm.wheelPlantingImg.img5" :disabled="false" size="small" type="img" />
            </el-form-item>
          </el-form-item>
          <el-form-item prop="goodsDetails" label="商品详情描述">
            <el-input v-model="dialogForm.goodsDetails" clearable placeholder="请输入商品详情描述" autosize type="textarea"/>
          </el-form-item>
          <el-form-item prop="detailsPath" label="商品描述图">
            <div class="lable-img"><span>建议：长750尺寸2M以下jpeg图</span></div>
            <el-form-item label-width="0" prop="detailsImg.img1" class="upload-img">
              <pp-upload :config="detailsUploadConfig" :option="{desc:'上传详情图',require:true,limitSize:2}" v-model="dialogForm.detailsImg.img1" :disabled="false" size="small" type="img" />
              </el-form-item>
            <el-form-item label-width="0" prop="detailsImg.img2" class="upload-img">
              <pp-upload :config="detailsUploadConfig" :option="{desc:'上传详情图',require:false,limitSize:2}" v-model="dialogForm.detailsImg.img2" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="detailsImg.img3" class="upload-img">
              <pp-upload :config="detailsUploadConfig" :option="{desc:'上传详情图',require:false,limitSize:2}" v-model="dialogForm.detailsImg.img3" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="detailsImg.img4" class="upload-img">
              <pp-upload :config="detailsUploadConfig" :option="{desc:'上传详情图',require:false,limitSize:2}" v-model="dialogForm.detailsImg.img4" :disabled="false" size="small" type="img" />
            </el-form-item>
            <el-form-item label-width="0" prop="detailsImg.img5" class="upload-img">
              <pp-upload :config="detailsUploadConfig" :option="{desc:'上传详情图',require:false,limitSize:2}" v-model="dialogForm.detailsImg.img5" :disabled="false" size="small" type="img" />
            </el-form-item>
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

  import FilterMixin                      from '@/mixins/filter.mixin'
  import cal                              from '@/utils/calculation'

  export default {
    mixins: [
      FilterMixin,
    ],
    props: {
      visible: Boolean,
      injectData: Object,
    },
    data () {
      const $ = this.$verify.$;
      const defaultDialogForm = {
        goodsBuyArea: '1',
        isHot: 'normal',
        platformName: '',
        discountPoints:'',
        goodsDiscountPrice:'',

        wheelPlantingImg:{},
        thumbnailImg:{},
        detailsImg:{},
      }
      const dialogForm = JSON.parse(JSON.stringify(defaultDialogForm));

      var validatorDiscountPrice = (rule, value, callback) => {  //检核折扣抵扣金额
        if (value !== '') {
          if (parseFloat(this.dialogForm.goodsPrice) < parseFloat(value)) {
            callback(new Error('折扣后价格不能大于折扣前价格'));
          }
          callback();
        }
      };

      var validatorPoints = (rule, value, callback) => {  //检核最高积分金额
        if (value !== '') {
          if (parseFloat(this.dialogForm.goodsDiscountPrice) <= parseFloat(value)) {
            callback(new Error('积分最高抵扣必须小于折扣后价格'));
          }
          callback();
        }
      };

      var validatorDetailsImg = (rule, value , callback) => {
          if(!this.dialogForm.detailsImg.img1 && !this.dialogForm.detailsImg.img2 && !this.dialogForm.detailsImg.img3 && !this.dialogForm.detailsImg.img4 && !this.dialogForm.detailsImg.img5){
            callback(new Error('请至少上传一张描述图'));
          }
          callback();
      };

      var validatorWheelPlantingImg = (rule, value , callback) => {
          if(!this.dialogForm.wheelPlantingImg.img1 && !this.dialogForm.wheelPlantingImg.img2 && !this.dialogForm.wheelPlantingImg.img3 && !this.dialogForm.wheelPlantingImg.img4 && !this.dialogForm.wheelPlantingImg.img5){
            callback(new Error('请至少上传一张轮播图'));
          }
          callback();
      };

      return {
        loading: false,
        title: '',

        defaultDialogForm,
        dialogForm,
        dialogFormRules:{
          goodsName: [$('required')],
          platformNo: [$('required')],
          shopNo: [$('required')],
          goodsPrice: [$('required'), $('amount')],
          goodsDiscountPrice: [$('required'), $('amount'),{ validator: validatorDiscountPrice, trigger: 'blur' }],
          discountPoints: [$('required'), $('intNumber'),{ validator: validatorPoints, trigger: 'blur' }],
          paymentPrice: [$('required')],
          shareAmount: [$('required'), $('amount')],
          goodsStockNum: [$('required'), $('intNumber')],
          limitNum: [$('required'), $('intNumber')],
          goodsSort: [$('required'),$('number')],
          goodsBuyArea: [$('required')],
          // goodsBuyArea: [$('required')],
          // startTime:[$('required')],
          endTime:[$('required')],
          isHot: [$('required')],
          goodsDetails: [$('required')],
          onefreightAmount: [$('required'), $('amount')],
          morefreightAmount: [$('required'), $('amount')],

          'thumbnailImg.img1': $('required','必传项'),
          'wheelPlantingImg.img1': [{ validator: validatorWheelPlantingImg, trigger: 'blur' }], 
          //'detailsImg.img1': $('required','必传项'),
           'detailsImg.img1':[{ validator: validatorDetailsImg, trigger: 'blur' }], 

        },

        disabled:false,
        hidden: false,
        platformEnum:[],
        shopEnum:[],
        thumbnailImg:{},
        zoneEnum:{  //上架专区
          '抢购专区':'2',
          '一般商品专区':'1',
        },
        statusEnum: { // 店铺状态
          '是': 'normal',
          '否': 'disabled',
        },

        thumbnailUploadConfig: {
          action: this.$appConfig.baseURL + this.$appConst.doUploadFile + 'thumbnailPath',
          headers: {
            'access-token': this.$session.get('access-token'),
          },
          takeValueKey:'publicUrl'
        },

        wheelPlantingUploadConfig: {
        action: this.$appConfig.baseURL + this.$appConst.doUploadFile + 'wheelPlantingPath',
          headers: {
          'access-token': this.$session.get('access-token'),
        },
        takeValueKey:'publicUrl'
        },
        detailsUploadConfig: {
        action: this.$appConfig.baseURL + this.$appConst.doUploadFile + 'detailsPath',
          headers: {
          'access-token': this.$session.get('access-token'),
        },
        takeValueKey:'publicUrl'
      },
      };
    },
    computed:{
       $(){
         return this.$verify.$;
       },
       paymentPrice(){
         if(this.dialogForm.goodsDiscountPrice && this.dialogForm.discountPoints){
           return cal.accSub(this.dialogForm.goodsDiscountPrice,this.dialogForm.discountPoints);
         }else if(this.dialogForm.goodsDiscountPrice){
           return this.dialogForm.goodsDiscountPrice; 
         }else if(this.dialogForm.discountPoints){
           return cal.accSub(0,this.dialogForm.discountPoints);
         }else{
           return '';
         }
         
       }
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
      selectValueChange(){
        const params = Object.assign({},this.dialogForm);
        if(params.goodsBuyArea == '1'){
          this.hidden = false;
        }else{
          this.hidden = true;
        }
      },

      close () {
        this.$emit('update:visible', false);
        this.initForm();
      },
      initForm () {

        this.dialogForm = JSON.parse(JSON.stringify(this.defaultDialogForm));
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
       submit () {
        let reqUrl = '';
        if (this.curType === 'new') {
          reqUrl = this.$appConst.doAddGoodsInfo;
        }
        if (this.curType === 'edit') {
          reqUrl = this.$appConst.doUpdateGoodsInfo;
        }
        
        //RNB金额传入
        this.dialogForm.paymentPrice = this.paymentPrice;

        if (!this.verifyData()) return null;
         if(this.dialogForm.goodsBuyArea == '1'){
           this.dialogForm.startTime = '';
           this.dialogForm.endTime = '';
         }
        const params = Object.assign({},this.dialogForm);
        this.formatterIpnutAmount(params,100);
        this.$http.post(reqUrl,params
        ).then((res) => {
          let {respMessage, respCode, data} = res || {};
          if(respCode === 'S0001'){
            this.$message.success(this.title+'成功');
            this.$emit('submit', res);
            this.close();
          }else {
            throw respMessage;
          }
        });
      },
      formatterIpnutAmount(data,ratio){     //传入的金额格式，乘以100按分传入
        data.shareAmount = cal.accMul(data.shareAmount,ratio);
        data.goodsPrice = cal.accMul(data.goodsPrice,ratio);
        data.goodsDiscountPrice = cal.accMul(data.goodsDiscountPrice,ratio);
        data.paymentPrice = cal.accMul(data.paymentPrice,ratio);
        data.onefreightAmount = cal.accMul(data.onefreightAmount,ratio);
        data.morefreightAmount = cal.accMul(data.morefreightAmount,ratio);
      },
      getShopArr (platformNo) { // 获取店铺列表
        let obj = {};
        obj = this.platformEnum.find((item) =>{
          return item.value === platformNo;
        });
        this.dialogForm.platformName = obj.label;

        this.$http.post(this.$appConst.reqEnumShop + 'shop', {
          platformNo,
        }).then((res) => {
          let {respMessage, respCode, data} = res || {};
          if(respCode === 'S0001'){
            this.shopEnum = data;
            if(this.curType == 'edit'){
              this.dialogForm.shopNo = '';
            }
          }
        });
      },
      showMod ({ data, index, type }) {
        this.curIndex = index; // 记录当前修改位置
        this.curType = type; // 记录当前修改位置
        this.platformEnum = data.platformNum;
        this.shopEnum = data.shopNum;

        if (this.curType === 'new') {
          this.title = "新增商品";
        }
        if (this.curType === 'edit') {
          this.title = "编辑商品";
          this.goodsDetail(data.id);
        }
      },

      goodsDetail(goodsNo){
        let goodsId = goodsNo;
        this.$http.post(this.$appConst.reqGoodsDetail,{
          goodsId,
        }).then((res) =>{
          let {respMessage, respCode, data} = res || {};
          if(respCode === 'S0001'){
            this.formatterIpnutAmount(data,0.01);
            this.dialogForm = data;
            if(this.dialogForm.goodsBuyArea != '1'){
              this.hidden = true;
            }
          }else{
            throw respMessage;
          }
        });
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
/*图片尺寸*/
.shop-operation-dialog .upload-img{
  width: 150px;
  height: 100px;
  margin-bottom: 30px;
  float: left;
  margin-right: 5px;
}
.shop-operation-dialog 
  .pp-upload .upload-small 
  .el-upload-dragger {
  max-height: 100px;
  width: 150px;
}

/*建议上传图片文字*/
.shop-operation-dialog .lable-img{
  margin-left: -130px;
  width: 110px;
  line-height: 18px;
  margin-top: 30px;
  float: left;
  color:red;
  font-size:12.5px;
}


</style>
