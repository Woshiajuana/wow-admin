
const data = () => {
    return {
        loading: false,

        objForm: {
            account: {
                value: '',
                icon: 'user',
                placeholder: '请输入账号',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入账号',
                    },
                ],
            },
            password: {
                value: '',
                type: 'password',
                icon: 'password',
                placeholder: '请输入密码',
                use: [
                    {
                        nonempty: true,
                        prompt: '请输入密码',
                    },
                ],
            },
        },
    };
};

export default {
    data,
}
