
const data = () => {

    return {
        arrTable: [],
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
            path: {
                value: '',
                placeholder: '请输入请求路径',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
            method: {
                value: '',
                label: '',
                placeholder: '请选择请求方式',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'select',
                valueKey: 'value',
                labelKey: 'label',
                options: [
                    { label: 'POST请求', value: 'POST' },
                    { label: 'GET请求', value: 'GET' },
                ],
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
            },
            {
                text: '初始化',
                type: 'danger',
                icon: 'el-icon-connection',
                event: 'init',
                tooltip: {
                    content: '服务新增接口，可点击此按钮一键录入哦',
                }
            }
        ],
    };
};

export default {
    data,
}
