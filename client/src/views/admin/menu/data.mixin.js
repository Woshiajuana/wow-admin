
const data = () => {

    return {
        arrTable: [],
        objQuery: {
            isLoading: false,
        },
        objFilterForm: {
            keyword: {
                value: '',
                placeholder: '请输入标题/路径',
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
