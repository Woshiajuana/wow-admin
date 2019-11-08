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
                        <el-form-item label="名称">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.remark }}</span>
                        </el-form-item>
                        <el-form-item label="日期">
                            <span>{{ props.row.created_at | filterDate}}</span>
                        </el-form-item>
                        <el-form-item label="权限">
                            <span>{{ props.row.is_root_group ? 'admin' : '非admin'}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建日期">
                <template slot-scope="scope">
                    <span>{{scope.row.created_at | filterDate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="160"
                label="操作">
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.is_root_group"
                        size="mini"
                        type="text"
                        @click="handleDialogDisplay({ type: 'edit', data: scope.row })"
                    >编辑</el-button>
                    <el-button
                        :disabled="scope.row.is_root_group"
                        type="text"
                        size="mini"
                        @click="handleDialogDisplay({ data: scope.row }, 'objAuthDialog')"
                    >设置权限</el-button>
                    <el-button
                        :disabled="scope.row.is_root_group"
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
        <auth-drawer
            @refresh="reqTableDataList"
            :display.sync="objAuthDialog.is"
            :data="objAuthDialog"
        ></auth-drawer>
    </div>
</template>

<script>
    import DialogMixin                          from '@/mixins/dialog'
    import FilterMixin                          from '@/mixins/filter'
    import DetailsDrawer                        from './details-drawer'
    import AuthDrawer                           from './auth-drawer'
    import DataMixin                            from './data.mixin'

    export default {
        name: 'AdminGroup',
        mixins: [
            DataMixin,
            FilterMixin,
            DialogMixin,
        ],
        created () {
            this.reqTableDataList();
            this.reqApiRouteList();
            this.reqMenuRouteList();
        },
        methods: {
            reqMenuRouteList () {
                this.$curl(this.$appConst.REQ_MENU_ROUTE_LIST).then((res) =>
                    this.$set(this.objAuthDialog, 'arrMenu', res || [])
                ).toast();
            },
            reqApiRouteList () {
                this.$curl(this.$appConst.REQ_API_ROUTE_LIST).then((res) =>
                    this.$set(this.objAuthDialog, 'arrApi', res || [])
                ).toast();
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.$curl(this.$appConst.REQ_USER_GROUP_LIST, {
                    ...this.objQuery,
                    ...options,
                }).then((res) => {
                    let { arrData = [], numTotal } = res || {};
                    this.arrTable = arrData;
                    this.objQuery.numTotal = numTotal;
                }).toast().finally(() => typeof callback === 'function' && callback());
            },
            handleDelete (item) {
                let { _id, name } = item;
                this.$confirm(`确定删除 ${name} ?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doDeleteDataItem(_id);
                }).null();
            },
            doDeleteDataItem (id) {
                this.$curl(this.$appConst.DO_DELETE_USER_GROUP, {
                    id,
                }).then(() => {
                    this.reqTableDataList();
                }).toast();
            }
        },
        components: {
            AuthDrawer,
            DetailsDrawer,
        },
    }
</script>

<style lang="scss">
    @import "~@assets/scss/define.scss";
</style>
