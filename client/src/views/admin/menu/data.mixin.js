
const data = () => {

    return {
        arrTable: [],
        arrOptions: [],
        objQuery: {
            numIndex: 1,
            numSize: 10,
            numTotal: 0,
        },
        objFilterForm: {
            title: {
                value: '',
                placeholder: '请输入标题关键字',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
            path: {
                value: '',
                placeholder: '请输入请求路径',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
        },
        arrFilterButton: [
            {
                text: '查询',
                loading: false,
                type: 'primary',
                icon: 'el-icon-search',
                event: 'filter',
            },
            {
                text: '新增',
                type: 'primary',
                icon: 'el-icon-plus',
                event: 'add',
            },
        ],
    };
};

export default {
    data,
}
