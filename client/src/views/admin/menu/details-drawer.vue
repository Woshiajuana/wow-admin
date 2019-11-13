
<template>
    <el-drawer
        class="drawer-view"
        :title="data.type === 'add' ? '新增菜单' : '编辑菜单'"
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
                <el-form-item label="标题" prop="title">
                    <el-input v-model.trim="ruleForm.title" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model.trim="ruleForm.path"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model.trim="ruleForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model.trim="ruleForm.component"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model.trim="ruleForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="重定向" prop="redirect">
                    <el-input v-model.trim="ruleForm.redirect"></el-input>
                </el-form-item>
                <el-form-item label="参数" prop="params">
                    <el-input v-model.trim="ruleForm.params"></el-input>
                </el-form-item>
                <el-form-item label="父路由" prop="father">
                    <el-select
                        v-model="ruleForm.father"
                        placeholder="请选择父菜单">
                        <el-option
                            v-for="(item, index) in data.arrMenu"
                            :key="index"
                            :label="item.title"
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

    export default {
        data () {
            return {
                loading: false,
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
                    this.$curl(type === 'add'
                        ? this.$appConst.DO_CREATE_MENU_ROUTE
                        : this.$appConst.DO_UPDATE_MENU_ROUTE, this.ruleForm).then((res) => {
                        this.$modal.toast(type === 'add' ? '新增成功' : '编辑成功', 'success');
                        this.$emit('refresh');
                        this.handleClose();
                    }).toast().finally(() => this.loading = false);
                });
            },
            assignmentData () {
                this.$nextTick(() => {
                    this.$refs.ruleForm.resetFields();
                    let { data } = this.data;
                    data && (this.ruleForm = { ...data, id: data._id });
                });
            },
        },
    };
</script>
