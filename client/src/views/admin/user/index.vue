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
                prop="avatar"
                label="头像">
                <template slot-scope="scope">
                    <img class="avatar" :src="scope.row.avatar" alt="头像"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="group.name"
                label="用户组">
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
                width="180" >
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleDialogDisplay({ type: 'edit', data: scope.row })"
                    >编辑</el-button>
                    <el-button
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleDialogEdit(scope.row)"
                    >禁用</el-button>
                    <el-button
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleDialogEdit(scope.row)"
                    >解锁</el-button>
                    <el-button
                        :disabled="scope.row.is_root"
                        type="text"
                        size="mini"
                        @click="handleDelete(scope.row)"
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
                this.$curl(this.$appConst.REQ_USER_GROUP_LIST).then((res) => {
                    this.$set(this.objDialog, 'arrGroup', res || [])
                }).toast();
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.$curl(this.$appConst.REQ_USER_LIST, {
                    ...this.objQuery,
                    ...options,
                }).then((res) => {
                    let { arrData = [], numTotal } = res || {};
                    this.arrTable = arrData;
                    this.objQuery.numTotal = numTotal;
                }).toast().finally(() => typeof callback === 'function' && callback());
            },
            handleDelete (item) {
                let { _id, nickname } = item;
                this.$confirm(`确定删除 ${nickname} ?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doDeleteDataItem(_id);
                }).null();
            },
            doDeleteDataItem (id) {
                this.$curl(this.$appConst.DO_DELETE_USER_INFO, {
                    id,
                }).then(() => {
                    this.reqTableDataList();
                }).toast();
            }
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
