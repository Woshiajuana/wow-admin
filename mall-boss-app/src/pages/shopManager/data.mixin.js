
const data = () => {
    return {
      loading: false,
      dialogVisible: false,
      dialogData: {},
      listData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchForm:{
        shopName:'',
        companyName: '',
        startTime: '',
        endTime: '',
      },
      searchDateRange: [],
      statusEnum: { // 店铺状态
        '可用': 'normal',
        '停用': 'disabled',
      },
      
      objInput: {
        shopName: {
          value: '',
          placeholder: '请输入店铺名',
          style: 'width: 200px; margin-right: 5px;',
          mode: 'input',
          event: 'filter',
        },
        companyName: {
          value: '',
          placeholder: '请输入公司名',
          style: 'width: 220px; margin-right: 5px;',
          mode: 'input',
          event: 'filter',
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
          text: '新增',
          loadingText: '新增',
          type: 'primary',
          icon: 'el-icon-plus',
          event: 'add',
        }
      ],

      platformEnum: [],
      product: {},
      fileList: []
    };
};

export default {
    data,
}