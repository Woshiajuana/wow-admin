<template>
    <div class="view-wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
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
                        <el-form-item label="操作员">
                            <span>{{ props.row.user && props.row.user.nickname }}</span>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <span>{{ props.row.user && props.row.user.phone }}</span>
                        </el-form-item>
                        <el-form-item label="接口">
                            <span>{{ props.row.api && props.row.api.name }}</span>
                        </el-form-item>
                        <el-form-item label="路径">
                            <span>{{ props.row.api && props.row.api.path }}</span>
                        </el-form-item>
                        <el-form-item label="日期">
                            <span>{{ props.row.created_at | filterDate}}</span>
                        </el-form-item>
                        <el-form-item label="参数">
                            <el-tooltip class="item" effect="dark" :content="JSON.stringify(props.row.params)" placement="top">
                                <span style="cursor: pointer">{...}</span>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="结果">
                            <el-tooltip class="item" effect="dark" :content="JSON.stringify(props.row.result)" placement="top">
                                <span :style="{ cursor: 'pointer', color: props.row.result.code === 'S00000' ? '#67C23A' : '#F56C6C'}">{{props.row.result.code === 'S00000' ? '成功' : '失败'}}</span>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="转化路径" v-if="props.row.target">
                            <span>{{ props.row.target }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="user.nickname"
                label="操作员">
            </el-table-column>
            <el-table-column
                prop="api.name"
                label="接口">
            </el-table-column>
            <el-table-column
                prop="result"
                label="结果">
                <template slot-scope="scope">
                    <span :style="{ color: scope.row.result.code === 'S00000' ? '#67C23A' : '#F56C6C'}">{{scope.row.result.code === 'S00000' ? '成功' : '失败'}}</span>
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
                width="80" >
                <el-button-group slot-scope="scope">
                    <el-button
                        :loading="scope.row.isDelLoading"
                        type="text"
                        size="mini"
                        @click="handleDelete(scope.row, 'isDelLoading')"
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
        name: 'Oplog',
        mixins: [
            DataMixin,
            FilterMixin,
        ],
        created () {
            this.reqTableDataList();
            this.reqApiRouteList();
            this.reqUserInfoList();
        },
        methods: {
            reqApiRouteList () {
                this.$curl(this.$appConst.REQ_API_ROUTE_LIST).then((res) => {
                    this.objFilterForm.api.options = res || [];
                }).toast();
            },
            reqUserInfoList () {
                this.$curl(this.$appConst.REQ_USER_LIST).then((res) => {
                    this.objFilterForm.user.options = res || [];
                }).toast();
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.objQuery.isLoading = true;
                this.$curl(this.$appConst.REQ_OPLOG_LIST, {
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
                let { _id } = item;
                this.$confirm(`确定删除该项?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$set(item, lKey, true);
                    this.$curl(this.$appConst.DO_DELETE_OPLOG, {
                        id: _id,
                    }).then(() => {
                        this.$modal.toast('删除账号成功', 'success');
                        this.reqTableDataList();
                    }).toast().finally(() => item[lKey] = false);
                }).null();
            },
        },
    }
</script>

