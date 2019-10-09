
const data = () => {

    return {
        arrTable: [],
        objQuery: {
            numIndex: 1,
            numSize: 10,
            numTotal: 0,
        },
        objFilterForm: {
            user: {
                value: '',
                label: '',
                placeholder: '请选择操作员',
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
            api: {
                value: '',
                label: '',
                placeholder: '请选择操作接口',
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
        ],
    };
};

export default {
    data,
}
