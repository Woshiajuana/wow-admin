<template>
    <div class="wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
            @add="handleDialogAdd"
        ></filter-view>
        <table-view
            @refresh="reqTableDataList"
            :table-query="objQuery"
            :table-data="arrTable">
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径">
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序">
            </el-table-column>
            <el-table-column
                prop="component"
                label="组件">
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
                width="150" >
                <el-button-group slot-scope="scope">
                    <el-button
                        :disabled="scope.row.source === 'INIT'"
                        size="mini"
                        @click="handleDialogEdit(scope.row)"
                    >编辑</el-button>
                    <el-button
                        :disabled="scope.row.source === 'INIT'"
                        type="danger"
                        size="mini"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                </el-button-group>
            </el-table-column>
        </table-view>
        <!--    新增    -->
        <operate-dialog
            @refresh="reqTableDataList"
            :operation_visible.sync="objDialog.is"
            :operation_data="objDialog"
            :operation_menu_data="arrOptions"
        ></operate-dialog>
    </div>
</template>

<script>
    import DialogMixin from '@/mixins/dialog'
    import FilterMixin from '@/mixins/filter'
    import OperateDialog from './operation-dialog'
    import DataMixin from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
            FilterMixin,
            DialogMixin,
        ],
        created () {
            this.reqTableDataList();
        },
        methods: {
            beforeDialogShow () {
                return this.$curl(this.$appConst.REQ_MENU_ROUTE_LIST).then((res) => {
                    this.arrOptions = res || [];
                    return Promise.resolve();
                }).catch(() => Promise.reject());
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.$curl(this.$appConst.REQ_MENU_ROUTE_LIST, {
                    ...this.objQuery,
                    ...options,
                }).then((res) => {
                    let { arrData = [], numTotal } = res || {};
                    this.arrTable = arrData;
                    this.objQuery.numTotal = numTotal;
                }).toast().finally(() => typeof callback === 'function' && callback());
            },
            handleDelete (item) {
                let { _id, title } = item;
                this.$confirm(`确定删除 ${title} ?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.doDeleteItem(_id);
                }).null();
            },
            doDeleteItem (id) {
                this.$curl(this.$appConst.DO_DELETE_MENU_ROUTE, {
                    id,
                }).then(() => {
                    this.reqTableDataList();
                }).toast();
            },
        },
        components: {
            OperateDialog,
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .inner{
        @extend %bsb;
        padding: 10px;
    }
</style>
