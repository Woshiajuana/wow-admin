
const data = () => {

    return {
        arrTable: [],
        objDialog: {
            is: false,
            data: {

            },
        },
        objQuery: {
            numIndex: 1,
            numSize: 10,
            numTotal: 0,
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
                route: {
                    path: '/',
                    params: {},
                },
                event: 'add',
            }
        ],
    };
};

export default {
    data,
}
