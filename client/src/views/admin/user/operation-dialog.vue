<template>
    <el-dialog
        :title="operation_data.type === 'add' ? '新增用户' : '编辑用户'"
        :visible.sync="operation_visible"
        :before-close="handleClose">
        <el-form
            size="mini"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
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
                <el-input v-model="ruleForm.password" placeholder="请输入密码" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="用户组" prop="group">
                <el-select v-model="ruleForm.group" placeholder="请选择用户组">
                    <el-option
                        v-for="(item, index) in operation_group_data"
                        :key="index"
                        :label="item.name"
                        :value="item._id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">确认</el-button>
                <el-button @click="handleClose">关闭</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>

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
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
            operation_visible (val) {
                if (val) this.assignmentData();
            },
        },
        props: {
            operation_visible: { default: false },
            operation_width: { default: '' },
            operation_data: { default: '' },
            operation_group_data: { default: '' },
        },
        methods: {
            handleClose () {
                this.$emit('update:operation_visible', false);
                this.resetForm();
            },
            handleSubmit () {
                this.$refs.ruleForm.validate((valid) => {
                    if (!valid) return false;
                    let { type, data } = this.operation_data;
                    this.$curl(type === 'add'
                        ? this.$appConst.DO_CREATE_USER_INFO
                        : this.$appConst.DO_UPDATE_USER_INFO, this.ruleForm).then((res) => {
                        this.$modal.toast(type === 'add' ? '新增成功' : '编辑成功', 'success');
                        this.$emit('refresh');
                        this.handleClose();
                    }).toast();
                });
            },
            resetForm () {
                this.$refs.ruleForm.resetFields();
            },
            assignmentData () {
                this.$nextTick(() => {
                    this.$refs.ruleForm.resetFields();
                    let { type, data } = this.operation_data;
                    data && (this.ruleForm = { ...data, id: data._id });
                })
            },
        },
    };
</script>

<style lang="scss" scoped>
</style>
