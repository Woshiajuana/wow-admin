<template>
    <el-dialog
        :title="operation_data.type === 'add' ? '新增用户组' : '编辑用户组'"
        :visible.sync="operation_visible"
        :before-close="handleClose">
        <el-form
            size="mini"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                <el-button @click="resetForm">关闭</el-button>
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
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户组名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '请填写备注', trigger: 'blur' }
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
            operation_data: { default: '' }
        },
        methods: {
            handleClose () {
                this.$emit('update:operation_visible', false);
                // this.resetForm();
            },
            handleSubmit () {
                this.$refs.ruleForm.validate((valid) => {
                    if (!valid) return false;
                    let { type, data } = this.operation_data;
                    this.$curl(type === 'add'
                        ? this.$appConst.DO_CREATE_USER_GROUP
                        : this.$appConst.DO_UPDATE_USER_GROUP, this.ruleForm).then((res) => {
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
                let { type, data } = this.operation_data;
                data && (this.ruleForm = { ...data, id: data._id });
            },
        },
    };
</script>

<style>


</style>
