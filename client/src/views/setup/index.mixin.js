
const data = () => {
    return {
        loading: false,
        numCurrent: 0,
        default: {
            logo: '',
        },
        arrForm: [
            {
                name: {
                    value: '',
                    icon: 'manage',
                    placeholder: '管理台名称',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置管理台名称',
                        },
                    ],
                },
                logo: {
                    value: '',
                    icon: 'logo-icon',
                    placeholder: '管理台LOGO (url链接)',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置管理台LOGO',
                        },
                    ],
                },
                bg: {
                    value: '',
                    icon: 'bg',
                    placeholder: '管理台背景图 (url链接) (非必填)',
                },
                color: {
                    value: '',
                    icon: 'bg-color',
                    placeholder: '管理台覆盖色 (非必填)',
                },
                ownership: {
                    value: '',
                    icon: 'ownership',
                    placeholder: '请设置所有权归属',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置所有权归属',
                        },
                    ],
                },
            },
            {
                nickname: {
                    value: '',
                    icon: 'user',
                    placeholder: '超级管理员昵称',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员昵称',
                        },
                    ],
                },
                password: {
                    value: '',
                    icon: 'password',
                    type: 'password',
                    placeholder: '超级管理员密码',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员密码',
                        },
                    ],
                },
                avatar: {
                    value: '',
                    icon: 'avatar',
                    placeholder: '超级管理员头像',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员头像',
                        },
                    ],
                },
                phone: {
                    value: '',
                    icon: 'phone',
                    placeholder: '超级管理员手机号',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员手机号',
                        },
                    ],
                },
                email: {
                    value: '',
                    icon: 'email',
                    placeholder: '超级管理员邮箱',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员邮箱',
                        },
                    ],
                },
            },
        ],
    };
};

export default {
    data,
}
