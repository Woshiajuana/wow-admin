
const data = () => {
    return {
        loading: false,

        objForm: {
            name: {
                value: '',
                icon: 'manage',
                placeholder: '请设置管理台名称',
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
                placeholder: '请设置管理台LOGO',
                use: [
                    {
                        nonempty: true,
                        prompt: '请设置管理台LOGO',
                    },
                ],
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
            nickname: {
                value: '',
                icon: 'user',
                placeholder: '请设置超级管理员昵称',
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
                placeholder: '请设置超级管理员密码',
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
                placeholder: '请设置超级管理员头像',
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
                placeholder: '请设置超级管理员手机号',
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
                placeholder: '请设置超级管理员邮箱',
                use: [
                    {
                        nonempty: true,
                        prompt: '请设置超级管理员邮箱',
                    },
                ],
            },
        },
    };
};

export default {
    data,
}
