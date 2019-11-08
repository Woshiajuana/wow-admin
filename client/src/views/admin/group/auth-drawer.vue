
<template>
    <el-drawer
        title="设置权限"
        :before-close="handleClose"
        :visible.sync="operation_visible"
        direction="rtl"
        size="50%"
        custom-class="demo-drawer"
        ref="drawer">
        <div class="demo-drawer__content">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="60px"
                class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="请输入名称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="API" prop="api_routes">
                    <el-select
                        multiple
                        collapse-tags
                        v-model="ruleForm.api_routes"
                        placeholder="请选择API">
                        <el-option
                            v-for="(item, index) in operation_api_data"
                            :key="index"
                            :label="item.name"
                            :value="item._id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单" prop="menu_routes">
                    <el-select
                        multiple
                        collapse-tags
                        v-model="ruleForm.menu_routes"
                        placeholder="请选择API">
                        <el-option
                            v-for="(item, index) in operation_menu_data"
                            :key="index"
                            :label="item.title"
                            :value="item._id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" placeholder="请输入备注" v-model.trim="ruleForm.remark" maxlength="100"></el-input>
                </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
                <el-button type="primary" @click="handleSubmit">确认</el-button>
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </div>
    </el-drawer>

</template>

<script>

    export default {
        data () {
            return {
                loading: false,
                ruleForm: {
                    name: '',
                    remark: '',
                    api_routes: [],
                    menu_routes: [],
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
            operation_data: { default: '' },
            operation_api_data: { default: '' },
            operation_menu_data: { default: '' },
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
                this.$nextTick(() => {
                    this.$refs.ruleForm.resetFields();
                    let { type, data } = this.operation_data;
                    data && (this.ruleForm = { ...data, id: data._id });
                })
            },
        },
    };
</script>

<style lang="scss">
    @import "~@assets/scss/define.scss";

    .el-drawer__body{
        padding: 20px;
    }
    .demo-drawer__content{
        @extend %df;
        @extend %h100;
        @extend %fdc;
        form {
            @extend %df1;
        }
    }
    .demo-drawer__footer {
        @extend %df;
        button {
            @extend %df1;
        }
    }
    .el-select{
        @extend %w100;
    }
    .el-form-item__label{
        @extend %fwn;
    }
</style>
