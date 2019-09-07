
const data = () => {

    let statusOptions = [
      { value: '1', label: '待支付', type: 'info' },
      { value: '2', label: '订单已关闭', type: 'warning' },
      { value: '3', label: '待发货(支付成功)', type: 'success' },
      { value: '4', label: '支付失败', type: 'warning' },
      { value: '5', label: '已发货', type: 'primary' },
    ];

    return {
      loading: false,
      dialogVisible: false,
      dialogData: {},
      listData: [],
      platformNoOptions:[],
      shopNoOptions:[],
      searchDate:[],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      searchForm:{
        goodsName:'',
        platformNo:'',
        shopNo:'',
        orderStatus:'',
      },
      statusOptions,

      objInput: {
        goodsName: {
          value: '',
          placeholder: '请输入商品名',
          style: 'width: 200px; margin-right: 5px;',
          mode: 'input',
          event: 'filter',
        },
        platformNo: {
          value: '',
          label: '',
          placeholder: '请选择所属平台',
          style: 'width: 170px; margin-right: 5px;',
          mode: 'select',
          options: [],
          event: 'selectPlatform',
        },
        shopNo: {
          value: '',
          label: '',
          placeholder: '请选择所属店铺',
          style: 'width: 200px; margin-right: 5px;',
          mode: 'select',
          options: [],
          event: 'selectShop',
        },
        orderStatus:{
          value: '',
          label: '',
          placeholder: '请选择订单状态',
          style: 'width: 200px; margin-right: 5px;',
          mode: 'select',
          options: statusOptions,
        },
        date: {
          value: '',
          style: 'margin-right: 5px;',
          mode: 'daterange',
        },
      },
      operateData: [
        {
          text: '查询',
          loadingText: '查询中',
          loading: false,
          type: 'primary',
          icon: 'el-icon-search',
          event: 'filter',
        },
        {
          text: '导出',
          loadingText: '导出中',
          loading: false,
          type: 'success',
          icon: 'el-icon-download',
          event: 'download',
        },
        {
          text: '模版下载',
          type: 'success',
          icon: 'el-icon-download',
          event: 'templateDownload',
        }
      ],
    };
    
};

export default {
    data,
}