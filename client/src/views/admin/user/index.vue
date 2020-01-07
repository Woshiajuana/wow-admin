<template>
    <div class="view-wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
            @add="handleDialogDisplay()"
        ></filter-view>
        <table-view
            @refresh="reqTableDataList"
            :table-query="objQuery"
            :table-data="arrTable">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form
                        size="mini"
                        label-position="left"
                        inline
                        class="demo-table-expand">
                        <el-form-item label="昵称">
                            <span>{{ props.row.nickname }}</span>
                        </el-form-item>
                        <el-form-item label="头像">
                            <img class="avatar" :src="props.row.avatar" alt="头像"/>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <span>{{ props.row.email }}</span>
                        </el-form-item>
                        <el-form-item label="手机">
                            <span>{{ props.row.phone }}</span>
                        </el-form-item>
                        <el-form-item label="用户组">
                            <span>{{ props.row.group.name }}</span>
                        </el-form-item>
                        <el-form-item label="日期">
                            <span>{{ props.row.created_at | filterDate}}</span>
                        </el-form-item>
                        <el-form-item label="根账号">
                            <span>{{ props.row.is_root ? '是' : '否'}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="昵称">
            </el-table-column>
            <el-table-column
                prop="group.name"
                label="权限">
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建日期">
                <template slot-scope="scope">
                    <span>{{scope.row.created_at | filterDate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleDialogDisplay({ type: 'edit', data: scope.row })"
                    >编辑</el-button>
                    <el-button
                        :loading="scope.row.isDisLoading"
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleDisabled(scope.row, 'isDisLoading')"
                    >{{scope.row.disabled ? '启用' : '禁用' }}</el-button>
                    <el-button
                        :loading="scope.row.isLockLoading"
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleUnlock(scope.row, 'isLockLoading')"
                    >{{scope.row.lock ? '解锁' : '锁定' }}</el-button>
                    <el-button
                        :disabled="scope.row.is_root"
                        :loading="scope.row.isDelLoading"
                        type="text"
                        size="mini"
                        @click="handleDelete(scope.row, 'isDelLoading')"
                    >删除</el-button>
                </template>
            </el-table-column>
        </table-view>
        <details-drawer
            @refresh="reqTableDataList"
            :display.sync="objDialog.is"
            :data="objDialog"
        ></details-drawer>
    </div>
</template>

<script>
    import DialogMixin                          from '@/mixins/dialog'
    import FilterMixin                          from '@/mixins/filter'
    import DetailsDrawer                        from './details-drawer'
    import DataMixin                            from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
            FilterMixin,
            DialogMixin,
        ],
        created () {
            this.reqUserGroupList();
            this.reqTableDataList();
        },
        methods: {
            reqUserGroupList () {
                this.$curl(this.$appConst._REQ_USER_GROUP_LIST).then((res) => {
                    this.$set(this.objDialog, 'arrGroup', res || []);
                    this.objFilterForm.group.options = res || [];
                }).toast();
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.objQuery.isLoading = true;
                this.$curl(this.$appConst._REQ_USER_LIST, {
                    ...this.objQuery,
                    ...options,
                }).then((res) => {
                    let { arrData = [], numTotal } = res || {};
                    this.arrTable = arrData;
                    this.objQuery.numTotal = numTotal;
                }).toast().finally(() => {
                    typeof callback === 'function' && callback();
                    this.objQuery.isLoading = false;
                });
            },
            handleDelete (item, lKey) {
                let { _id, nickname } = item;
                this.$confirm(`确定删除昵称为：${nickname} 的账号?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$set(item, lKey, true);
                    this.$curl(this.$appConst._DO_DELETE_USER_INFO, {
                        id: _id,
                    }).then(() => {
                        this.$modal.toast('删除账号成功', 'success');
                        this.reqTableDataList();
                    }).toast().finally(() => item[lKey] = false);
                }).null();
            },
            handleUnlock (item, lKey) {
                let { _id, nickname, lock } = item;
                this.$confirm(`确定${lock ? '解锁' : '锁定'} 昵称为：${nickname} 的账号?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$set(item, lKey, true);
                    this.$curl(this.$appConst._DO_UNLOCK_USER_INFO, {
                        id: _id,
                        lock: !lock,
                    }).then(() => {
                        this.$modal.toast(lock ? '解锁账号成功' : '锁定账号成功', 'success');
                        item.lock = !lock;
                    }).toast().finally(() => item[lKey] = false);
                }).null();
            },
            handleDisabled (item, lKey) {
                let { _id, nickname, disabled } = item;
                this.$confirm(`确定${disabled ? '启用' : '禁用'} 昵称为：${nickname} 的账号?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$set(item, lKey, true);
                    this.$curl(this.$appConst._DO_DISABLED_USER_INFO, {
                        id: _id,
                        disabled: !disabled,
                    }).then(() => {
                        this.$modal.toast(disabled ? '启用账号成功' : '禁用账号成功', 'success');
                        item.disabled = !disabled;
                    }).toast().finally(() => item[lKey] = false);
                }).null();
            },
        },
        components: {
            DetailsDrawer,
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .avatar{
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }
</style>
