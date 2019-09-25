<template>
    <el-dialog
        :title="operation_title"
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
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit('ruleForm')">立即创建</el-button>
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
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入 用户组名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '请填写备注', trigger: 'blur' }
                    ]
                }
            }
        },
        props: {
            operation_title: { default: '' },
            operation_visible: { default: false },
            operation_width: { default: '' },
        },
        methods: {
            handleClose () {
                this.$emit('update:operation_visible', false);
            },
            handleSubmit () {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
    };
</script>

<style>


</style>
