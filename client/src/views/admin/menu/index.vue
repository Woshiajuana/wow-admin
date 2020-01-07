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
            :default-expand-all="true"
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
                prop="component"
                label="组件">
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序">
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
                        @click="handleDialogDisplay({ type: 'edit', data: scope.row })"
                    >编辑</el-button>
                    <el-button
                        :disabled="scope.row.source === 'INIT'"
                        :loading="scope.row.isDelLoading"
                        type="text"
                        size="mini"
                        @click="handleDelete(scope.row, 'isDelLoading')"
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
                return this.$curl(this.$appConst._REQ_MENU_ROUTE_LIST).then((res) => {
                    this.$set(this.objDialog, 'arrMenu', res || []);
                    return Promise.resolve();
                }).catch(() => Promise.reject());
            },
            reqTableDataList (callback) {
                let options = this.$verify.input(this.objFilterForm);
                this.objQuery.isLoading = true;
                this.$curl(this.$appConst._REQ_MENU_ROUTE_LIST, {
                    ...this.objQuery,
                    ...options,
                }).then((res) => {
                    this.arrTable = this.formatData(JSON.parse(JSON.stringify(res)));
                }).toast().finally(() => {
                    typeof callback === 'function' && callback();
                    this.objQuery.isLoading = false;
                });
            },
            // 过滤菜单
            formatData (source = []) {
                let arrNeedDelIndex = [];
                source.forEach((item, index) => {
                    source.forEach((menu) => {
                        if (item.father === menu._id) {
                            menu.children ? menu.children.push(item) : menu.children = [item];
                            arrNeedDelIndex.push(index);
                        }
                    })
                });
                arrNeedDelIndex.forEach((item, index) => {
                    source.splice(item - index, 1);
                });
                return source;
            },
            handleDelete (item, lKey) {
                let { _id, title } = item;
                this.$confirm(`确定删除菜单： ${title} ?`, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$set(item, lKey, true);
                    this.$curl(this.$appConst._DO_DELETE_MENU_ROUTE, {
                        id: _id,
                    }).then(() => {
                        this.$modal.toast('删除账号成功', 'success');
                        this.reqTableDataList();
                    }).toast().finally(() => item[lKey] = false);
                }).null();
            },
        },
        components: {
            DetailsDrawer,
        },
    }
</script>
