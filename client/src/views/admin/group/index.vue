<template>
    <div class="wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
            @add="objDialog.is = true"
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
                prop="is_root_group"
                label="是否是超级管理用户组">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.is_root_group ? 'danger' : 'info'">
                        {{scope.row.is_root_group ? '是' : '否'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建日期">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="150" >
                <el-button-group slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleSelect(scope.row.orderNo)"
                    >编辑</el-button>
                    <el-button
                        type="danger"
                        size="mini"
                        @click="handleSelect(scope.row.orderNo)"
                    >删除</el-button>
                </el-button-group>
            </el-table-column>
        </table-view>
        <!--    新增    -->
        <operate-dialog
            @refresh="reqTableDataList"
            :operation_visible.sync="objDialog.is"
            operation_title="新增用户组"
        ></operate-dialog>
    </div>
</template>

<script>
    import OperateDialog from './operation-dialog'
    import DataMixin from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
        ],
        created () {
            this.reqTableDataList();
        },
        methods: {
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
            handleSelect () {

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
