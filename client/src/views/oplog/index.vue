<template>
    <div class="wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
        ></filter-view>
        <table-view
            @refresh="reqTableDataList"
            :table-query="objQuery"
            :table-data="arrTable">
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径">
            </el-table-column>
            <el-table-column
                prop="method"
                label="请求方式">
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建日期">
            </el-table-column>
            <el-table-column
                label="操作"
                width="150" >
                <el-button-group slot-scope="scope">
                    <el-button
                        type="danger"
                        size="mini"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                </el-button-group>
            </el-table-column>
        </table-view>
    </div>
</template>

<script>
    import DialogMixin from '@/mixins/dialog'
    import DataMixin from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
            DialogMixin,
        ],
        created () {
            this.reqTableDataList();
        },
        methods: {
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.$curl(this.$appConst.REQ_OPLOG_LIST, {
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
            doDeleteDataItem(id) {
                this.$curl(this.$appConst.DO_DELETE_OPLOG, {
                    id,
                }).then(() => {
                    this.reqTableDataList();
                }).toast();
            },
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
