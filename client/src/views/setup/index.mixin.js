
const data = () => {
    return {
        loading: false,

        objForm: {
            name: {
                value: 'Wow-Admin Manage',
                placeholder: '请输入管理台名称',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入管理台名称',
                    },
                ],
            },
            logo: {
                value: 'https://img.mukewang.com/5d7ee31e00017e2118720632.jpg',
                placeholder: '请设置观礼台 LOGO',
                use: [
                    {
                        nonempty: true,
                        prompt: '请设置观礼台 LOGO',
                    },
                ],
            },
            theme: {
                value: 'DEFAULT',
                placeholder: '请选择主题',
                use: [
                    {
                        nonempty: true,
                        prompt: '请设置观礼台 LOGO',
                    },
                ],
            },
            ownership: {
                value: '归属 AJUAN 所有',
                placeholder: '请输入所有权归属',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入所有权归属',
                    },
                ],
            },
            nickname: {
                value: 'admin',
                placeholder: '请输入超级管理员昵称',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入超级管理员昵称',
                    },
                ],
            },
            password: {
                value: '123456',
                type: 'password',
                placeholder: '请输入超级管理员密码',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入超级管理员密码',
                    },
                ],
            },
            avatar: {
                value: 'https://img.mukewang.com/5d7ee31e00017e2118720632.jpg',
                placeholder: '请设置超级管理员头像',
                use: [
                    {
                        nonempty: true,
                        prompt: '请设置超级管理员头像',
                    },
                ],
            },
            phone: {
                value: '13188888888',
                placeholder: '请输入超级管理员手机号',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入超级管理员手机号',
                    },
                ],
            },
            email: {
                value: '979703986@qq.com',
                placeholder: '请输入超级管理员邮箱',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入超级管理员邮箱',
                    },
                ],
            },
        },
    };
};

export default {
    data,
}
