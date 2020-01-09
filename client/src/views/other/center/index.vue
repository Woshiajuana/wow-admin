<template>
    <div class="view-wrap">
        <div class="view-inner">
            <el-form
                style="max-width: 500px"
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="120px">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model.trim="ruleForm.nickname" clearable placeholder="请输入昵称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model.trim="ruleForm.password" clearable type="password" placeholder="请输入密码" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-input v-model.trim="ruleForm.avatar" clearable placeholder="请输入头像链接"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input :value="ruleForm.email || '无'" disabled placeholder="请输入邮箱" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input :value="ruleForm.phone || '无'" disabled placeholder="请输入手机号" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="group">
                    <el-input :value="ruleForm.group ? ruleForm.group.name : '无'" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="handleSubmit">{{ loading ? '更新中...' : '更新' }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { mapGetters }                   from 'vuex'
    import Md5                              from 'md5'

    export default {
        name: 'OtherCenter',
        data () {
            return {
                loading: false,
                ruleForm: {
                    nickname: '',
                    password: '',
                    avatar: '',
                    phone: '',
                    email: '',
                    group: '',
                },
                rules: {
                    nickname: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                    ],
                    avatar: [
                        { required: true, message: '请填写头像', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                }
            };
        },
        computed: {
            ...mapGetters([
                'objUserInfo',
            ]),
        },
        created () {
            this.ruleForm = { ...this.ruleForm, ...this.objUserInfo };
        },
        methods: {
            handleSubmit () {
                this.$refs.ruleForm.validate((valid) => {
                    if (!valid) return false;
                    this.loading = true;
                    this.$curl(this.$appConst._DO_CHANGE_USER_CENTER_INFO, {
                        ...this.ruleForm,
                        password: Md5(this.ruleForm.password.trim())
                    }).then((res) => {
                        this.$modal.toast('更新成功', 'success');
                        delete res.group;
                        this.ruleForm.password = '';
                        this.$store.commit('user/UPT_USER_INFO', res || {});
                    }).toast().finally(() => this.loading = false);
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .view-wrap{
        @extend %df;
    }
    .view-inner {
        @extend %bsb;
        @extend %df1;
        @extend %oya;
        padding: 80px 10px;
        background-color: #fff;
        border-radius: 4px;
    }
    .avatar{
        @extend %bsb;
        border: 2px saddlebrown solid;
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
</style>
