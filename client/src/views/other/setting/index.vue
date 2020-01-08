<template>
    <div class="view-wrap">
        <div class="view-inner">
            <el-form
                style="max-width: 500px"
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="80px">
                <el-form-item label="管理台名称" prop="nickname">
                    <el-input v-model.trim="ruleForm.nickname" clearable placeholder="请输入管理台名称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="管理台LOGO" prop="logo">
                    <el-input v-model.trim="ruleForm.logo" clearable placeholder="管理台LOGO (url链接) (非必填)"></el-input>
                </el-form-item>
                <el-form-item label="管理台背景" prop="bg">
                    <el-input v-model.trim="ruleForm.bg" clearable placeholder="管理台背景图 (url链接) (非必填)"></el-input>
                </el-form-item>
                <el-form-item label="管理台颜色" prop="color">
                    <el-input v-model.trim="ruleForm.color" clearable placeholder="管理台颜色(非必填)" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="管理台归属" prop="ownership">
                    <el-input v-model.trim="ruleForm.ownership" clearable placeholder="所有权归属" maxlength="50"></el-input>
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
                    name: '',
                    logo: '',
                    bg: '',
                    color: '',
                    ownership: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请设置管理台名称', trigger: 'blur' },
                    ],
                    ownership: [
                        { required: true, message: '请设置所有权归属', trigger: 'blur' }
                    ],
                }
            };
        },
        computed: {
            ...mapGetters([
                'sidebar',
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
        padding: 50px 10px;
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
