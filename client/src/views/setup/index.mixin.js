
import regular                              from '@utils/regular'

const data = () => {
    return {
        loading: false,
        numCurrent: 0,
        arrForm: [
            {
                name: {
                    value: '',
                    icon: 'manage',
                    placeholder: '管理台名称',
                    max: 20,
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
                    max: 100,
                    placeholder: '管理台LOGO (url链接) (非必填)',
                },
                bg: {
                    value: '',
                    icon: 'bg',
                    max: 100,
                    placeholder: '管理台背景图 (url链接) (非必填)',
                },
                color: {
                    value: '',
                    icon: 'bg-color',
                    max: 20,
                    placeholder: '管理台覆盖色 (非必填)',
                },
                ownership: {
                    value: '',
                    icon: 'ownership',
                    max: 50,
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
                    max: 20,
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
                    max: 20,
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
                    max: 100,
                    placeholder: '超级管理员头像',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员头像 (url链接)',
                        },
                    ],
                },
                phone: {
                    value: '',
                    icon: 'phone',
                    max: 11,
                    placeholder: '超级管理员手机号',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员手机号',
                        },
                        {
                            rule: regular.isPhone,
                            prompt: '超级管理员手机号设置有误',
                        },
                    ],
                },
                email: {
                    value: '',
                    icon: 'email',
                    max: 50,
                    placeholder: '超级管理员邮箱',
                    use: [
                        {
                            nonempty: true,
                            prompt: '请设置超级管理员邮箱',
                        },
                        {
                            rule: regular.isEmail,
                            prompt: '超级管理员邮箱设置有误',
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
