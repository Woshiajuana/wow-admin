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
                prop="nickname"
                label="昵称">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机">
            </el-table-column>
            <el-table-column
                prop="group.name"
                label="用户组">
            </el-table-column>
            <el-table-column
                prop="is_root_group"
                label="是否是根账号">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.is_root ? 'danger' : 'info'">
                        {{scope.row.is_root ? '是' : '否'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="创建日期">
            </el-table-column>
        </table-view>
    </div>
</template>

<script>
    import DataMixin from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
        ],
        created () {
            this.reqUserGroupList();
            this.reqTableDataList();
        },
        methods: {
            reqUserGroupList () {
                this.$curl(this.$appConst.REQ_USER_GROUP_LIST).then((res) => {
                    this.objFilterForm.group.options = res;
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
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .inner{
        @extend %bsb;
        padding: 10px;
    }
</style>
