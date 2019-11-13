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
                        <el-form-item label="标题">
                            <span>{{ props.row.title }}</span>
                        </el-form-item>
                        <el-form-item label="路径">
                            <span>{{ props.row.path }}</span>
                        </el-form-item>
                        <el-form-item label="排序">
                            <span>{{ props.row.sort }}</span>
                        </el-form-item>
                        <el-form-item label="组件">
                            <span>{{ props.row.component }}</span>
                        </el-form-item>
                        <el-form-item label="初始菜单">
                            <span>{{ props.row.source === 'INIT' ? '是' : '否'}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径">
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
                width="130">
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.source === 'INIT'"
                        type="text"
                        size="mini"
                        @click="handleDialogEdit(scope.row)"
                    >编辑</el-button>
                    <el-button
                        :disabled="scope.row.source === 'INIT'"
                        type="text"
                        size="mini"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </table-view>
        <!--    新增    -->
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
    import DataMixin                            from './data.mixin'
    import DetailsDrawer                        from './details-drawer'

    export default {
        name: 'AdminMenu',
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
                    this.$set(this.objDialog, 'arrMenu', res || []);
                    return Promise.resolve();
                }).catch(() => Promise.reject());
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.objQuery.isLoading = true;
                this.$curl(this.$appConst.REQ_MENU_ROUTE_LIST, {
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
            DetailsDrawer,
        },
    }
</script>

