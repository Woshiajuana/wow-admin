
<template>
    <el-drawer
        class="drawer-view"
        :title="data.type === 'add' ? '新增用户组' : '编辑用户组'"
        :before-close="handleClose"
        :visible.sync="display"
        direction="rtl"
        size="50%"
        custom-class="demo-drawer"
        ref="drawer">
        <div class="demo-drawer__content">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="80px"
                class="demo-ruleForm">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="ruleForm.nickname" placeholder="请输入昵称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" placeholder="请输入邮箱" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="请输入手机号" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-input v-model="ruleForm.avatar" placeholder="请输入头像链接"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="用户组" prop="group">
                    <el-select v-model="ruleForm.group" filterable placeholder="请选择用户组">
                        <el-option
                            v-for="(item, index) in data.arrGroup"
                            :key="index"
                            :label="item.name"
                            :value="item._id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
                <el-button type="primary" :loading="loading" @click="handleSubmit">{{ loading ? '提交中...' : '确认' }}</el-button>
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
    import Md5                              from 'md5'

    export default {
        data () {
            return {
                loading: false,
                ruleForm: {
                    nickname: '',
                    email: '',
                    phone: '',
                    avatar: '',
                    group: '',
                    password: '',
                },
                rules: {
                    nickname: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, message: '请填写邮箱', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请填写手机号', trigger: 'blur' }
                    ],
                    avatar: [
                        { required: true, message: '请填写头像', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    group: [
                        { required: true, message: '请选择用户组', trigger: 'blur' }
                    ],
                }
            }
        },
        watch: {
            display (val) {
                if (val) this.assignmentData();
            },
        },
        props: {
            display: { default: false },
            data: { default: '' },
        },
        methods: {
            handleClose () {
                this.$emit('update:display', false);
                this.$refs.ruleForm.resetFields();
            },
            handleSubmit () {
                this.$refs.ruleForm.validate((valid) => {
                    if (!valid) return false;
                    this.loading = true;
                    let { type, data } = this.data;
                    this.$curl(type === 'add' ? this.$appConst.DO_CREATE_USER_INFO : this.$appConst.DO_UPDATE_USER_INFO, {
                        ...this.ruleForm,
                        password: Md5(this.ruleForm.password.trim())
                    }).then((res) => {
                        this.$modal.toast(type === 'add' ? '新增成功' : '编辑成功', 'success');
                        this.$emit('refresh');
                        this.handleClose();
                    }).toast();
                });
            },
            assignmentData () {
                this.$nextTick(() => {
                    this.$refs.ruleForm.resetFields();
                    let { data } = this.data;
                    data && (this.ruleForm = { ...data, id: data._id, group: data.group._id });
                });
            },
        },
    };
</script>
