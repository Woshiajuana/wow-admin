
const data = () => {
    let isHotOptions = [ // 是否热门
      { value: 'normal', label: '是'},
      { value: 'disabled', label: '否'},
    ]
    let buyAreaOptions = [ // 上架专区
      { value: '2', label: '抢购专区'},
      { value: '1', label: '一般商品专区'},
    ]

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
        shopNo:'',
        shopName:'',
        email: '',
        phone: '',
        status: '',
      },
      searchDateRange: [],
      isHotOptions,
      buyAreaOptions,

      objInput: {
        goodsName: {
          value: '',
          placeholder: '请输入商品标题',
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
        goodsBuyArea: {
          value: '',
          label: '',
          placeholder: '请选择商品专区',
          style: 'width: 160px; margin-right: 5px;',
          mode: 'select',
          options: buyAreaOptions,
          event: '',
        },
        isHot: {
          value: '',
          label: '',
          placeholder: '请选择是否热门推荐',
          style: 'width: 180px; margin-right: 5px;',
          mode: 'select',
          options: isHotOptions,
          event: '',
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
    };
};

export default {
    data,
}