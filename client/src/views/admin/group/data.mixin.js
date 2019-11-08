
const data = () => {

    return {
        arrTable: [],

        objDialog: {
            is: false, // 是否显示
            current: 'add',
            add: {
                form: {
                    name: '',
                    remark: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户组名称', trigger: 'blur' },
                    ],
                    remark: [
                        { required: true, message: '请填写备注', trigger: 'blur' }
                    ],
                },
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
                event: 'add',
            }
        ],
    };
};

export default {
    data,
}
