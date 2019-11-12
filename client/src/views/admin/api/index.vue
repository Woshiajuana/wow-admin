<template>
    <div class="view-wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
            @init="handleInit"
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
    import FilterMixin                          from '@/mixins/filter'
    import DataMixin                            from './data.mixin'

    export default {
        name: 'AdminApi',
        mixins: [
            DataMixin,
            FilterMixin,
        ],
        created () {
            this.reqTableDataList();
        },
        methods: {
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.$curl(this.$appConst.REQ_API_ROUTE_LIST, {
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
                    this.$curl(this.$appConst.DO_DELETE_API_ROUTE, {
                        id: _id,
                    }).then(() => {
                        this.reqTableDataList();
                    }).toast();
                }).null();
            },
            handleInit () {
                this.$confirm(`确定刷新初始化获取最新API ?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$curl(this.$appConst.DO_INIT_API_ROUTE).then(() => {
                    }).null().finally(() => this.reqTableDataList());
                }).null();

            },
        },
    }
</script>

