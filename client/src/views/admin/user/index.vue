<template>
    <div class="view-wrap">
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
                <template slot-scope="scope">
                    <span>{{scope.row.created_at | filterDate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="150" >
                <el-button-group slot-scope="scope">
                    <el-button
                        :disabled="scope.row.is_root"
                        size="mini"
                        @click="handleDialogEdit(scope.row)"
                    >编辑</el-button>
                    <el-button
                        :disabled="scope.row.is_root"
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
            :operation_group_data="arrUserGroup"
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
            this.reqUserGroupList();
            this.reqTableDataList();
        },
        methods: {
            reqUserGroupList () {
                this.$curl(this.$appConst.REQ_USER_GROUP_LIST).then((res) => {
                    this.arrUserGroup = res || [];
                    this.objFilterForm.group.options = this.arrUserGroup;
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
                    this.doDeleteUserInfo(_id);
                }).null();
            },
            doDeleteUserInfo (id) {
                this.$curl(this.$appConst.DO_DELETE_USER_INFO, {
                    id,
                }).then(() => {
                    this.reqTableDataList();
                }).toast();
            }
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
    .avatar{
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }
</style>
