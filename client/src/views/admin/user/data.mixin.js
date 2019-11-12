
const data = () => {

    return {
        arrTable: [],
        objQuery: {
            numIndex: 1,
            numSize: 10,
            numTotal: 0,
            isLoading: false,
        },
        objFilterForm: {
            keyword: {
                value: '',
                placeholder: '请输入昵称/邮箱/手机',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
            group: {
                value: '',
                label: '',
                placeholder: '请选择用户组',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'select',
                valueKey: '_id',
                labelKey: 'name',
                options: [],
                event: 'selectPlatform',
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
