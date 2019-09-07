
const data = () => {

    let gradeOptions =  [
      { value: '0', label: '普通会员' },
      { value: '1', label: 'VIP' },
      { value: '2', label: '秀才' },
      { value: '3', label: '探花' },
      { value: '4', label: '榜眼' },
      { value: '5', label: '状元' },
      { value: '6', label: '王爷' },
      { value: '7', label: '皇帝' },
    ];

    let gradeData = gradeOptions.map(item => item.label);

    return {
      loading: false,
      dialogVisible: false,
      dialogData: {
        data: [],
        gradeData,
      },
      listData: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      searchForm:{
        goodsName:'',
        shopName:'',
      },

      objInput: {
        orderNo: {
          value: '',
          placeholder: '请输入订单号',
          style: 'width: 200px; margin-right: 5px;',
          mode: 'input',
          event: 'filter',
        },
        userPhone: {
          value: '',
          placeholder: '请输入用户手机号',
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
        }
      ],
    };
    
};

export default {
    data,
}