<template>
    <el-dialog
        :title="operation_data.type === 'add' ? '新增菜单' : '编辑菜单'"
        :visible.sync="operation_visible"
        :before-close="handleClose">
        <el-form
            size="mini"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm">
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
                <el-input v-model="ruleForm.path"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="组件" prop="component">
                <el-input v-model="ruleForm.component"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="ruleForm.icon"></el-input>
            </el-form-item>
            <el-form-item label="重定向" prop="redirect">
                <el-input v-model="ruleForm.redirect"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="params">
                <el-input v-model="ruleForm.params"></el-input>
            </el-form-item>
            <el-form-item label="父路由" prop="father">
                <el-select
                    v-model="ruleForm.father"
                    placeholder="请选择API">
                    <el-option
                        v-for="(item, index) in operation_menu_data"
                        :key="index"
                        :label="item.title"
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
                ruleForm: {
                    title: '',
                    path: '',
                    params: '',
                    father: null,
                    sort: '',
                    component: '',
                    redirect: '',
                    icon: '',
                },
                rules: {
                    title: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    path: [
                        { required: true, message: '请填写路径', trigger: 'blur' }
                    ],
                    component: [
                        { required: true, message: '请填写组件', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请填写排序', trigger: 'blur' }
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
