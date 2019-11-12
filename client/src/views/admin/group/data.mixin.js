
const data = () => {

    return {
        arrTable: [],
        objAuthDialog: {
            is: false,
            data: '',
        },
        objQuery: {
            numIndex: 1,
            numSize: 10,
            numTotal: 0,
            isLoading: false,
        },
        objFilterForm: {
            name: {
                value: '',
                placeholder: '请输入名称关键字',
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
            }
        ],
    };
};

export default {
    data,
}
