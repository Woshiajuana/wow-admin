
const data = () => {

    return {
        arrTable: [],
        objQuery: {
            numIndex: 1,
            numSize: 10,
            numTotal: 0,
        },
        objInput: {
            nickname: {
                value: '',
                placeholder: '请输入昵称',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
            email: {
                value: '',
                placeholder: '请输入邮箱',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
            phone: {
                value: '',
                placeholder: '请输入手机',
                style: 'width: 200px; margin-right: 5px;',
                mode: 'input',
                event: 'filter',
            },
            group: {
                value: '',
                label: '',
                placeholder: '请选择用户组',
                style: 'width: 170px; margin-right: 5px;',
                mode: 'select',
                options: [],
                event: 'selectPlatform',
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
