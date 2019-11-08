
<template>
    <el-drawer
        class="drawer-view"
        title="设置用户组权限"
        :before-close="handleClose"
        :visible.sync="display"
        direction="rtl"
        size="80%"
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
                    <el-input v-model.trim="ruleForm.name" disabled placeholder="请输入名称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="API" prop="api_routes">
                    <el-transfer
                        v-model="ruleForm.api_routes"
                        :props="{ key: 'value', label: 'desc' }"
                        :data="data.arrApi">
                    </el-transfer>
                </el-form-item>
                <el-form-item label="API" prop="api_routes">
                    <el-transfer
                        v-model="ruleForm.api_routes"
                        :props="{ key: 'value', label: 'desc' }"
                        :data="data.arrApi">
                    </el-transfer>
                </el-form-item>
            </el-form>
        </div>
        <div class="demo-drawer__footer">
            <el-button type="primary" :loading="loading" @click="handleSubmit">{{ loading ? '提交中...' : '确认' }}</el-button>
            <el-button @click="handleClose">关闭</el-button>
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
                    api_routes: [],
                },
                rules: {

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
                        ? this.$appConst.DO_CREATE_USER_GROUP
                        : this.$appConst.DO_UPDATE_USER_GROUP, this.ruleForm).then((res) => {
                        this.$modal.toast(type === 'add' ? '新增成功' : '编辑成功', 'success');
                        this.$emit('refresh');
                        this.handleClose();
                    }).toast().finally(() => this.loading = false);
                });
            },
            assignmentData () {
                this.$nextTick(() => {
                    this.$refs.ruleForm.resetFields();
                    let { type, data } = this.data;
                    data && (this.ruleForm = { ...data, id: data._id });
                });
            },
        },
    };
</script>
