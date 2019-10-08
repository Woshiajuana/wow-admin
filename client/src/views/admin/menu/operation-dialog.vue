<template>
    <el-dialog
        :title="operation_data.type === 'add' ? '新增API' : '编辑API'"
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
            <el-form-item label="路径" prop="path">
                <el-input v-model="ruleForm.path"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="method">
                <el-radio-group v-model="ruleForm.method">
                    <el-radio label="POST" value="POST"></el-radio>
                    <el-radio label="GET" value="GET"></el-radio>
                </el-radio-group>
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
                ruleForm: {
                    name: '',
                    path: '',
                    method: 'POST',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户组名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    path: [
                        { required: true, message: '请填写API路径', trigger: 'blur' }
                    ],
                    method: [
                        { required: true, message: '请选择请求方式', trigger: 'blur' }
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
                this.resetForm();
            },
            handleSubmit () {
                this.$refs.ruleForm.validate((valid) => {
                    if (!valid) return false;
                    let { type, data } = this.operation_data;
                    this.$curl(type === 'add'
                        ? this.$appConst.DO_CREATE_MENU_ROUTE
                        : this.$appConst.DO_UPDATE_MENU_ROUTE, this.ruleForm).then((res) => {
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

<style>


</style>
