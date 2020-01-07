<template>
    <div class="view-wrap">
        <filter-view
            :filter-form="objFilterForm"
            :filter-button="arrFilterButton"
            @filter="reqTableDataList"
            @add="handleDialogDisplay()"
        ></filter-view>
        <div class="main-wrap"
             v-if="false"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             v-loading="objQuery.isLoading">
            <el-tree
                :data="arrTable"
                node-key="_id"
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{data.title}} (路径：{{data.path}})组件：{{data.component}}</span>
                    <el-button
                       :disabled="data.source === 'INIT'"
                       type="text"
                       size="mini"
                       @click="handleDialogDisplay({ type: 'edit', data: data })"
                    >编辑</el-button>
                    <el-button
                        :disabled="data.source === 'INIT'"
                        :loading="node.isDelLoading"
                        type="text"
                        size="mini"
                        @click="handleDelete(data, 'isDelLoading')"
                    >删除</el-button>
                </span>
            </el-tree>
        </div>

        <table-view
            @refresh="reqTableDataList"
            :table-query="objQuery"
            :table-data="arrTable">
<!--            <el-table-column type="expand">-->
<!--                <template slot-scope="props">-->
<!--                    <el-form-->
<!--                        size="mini"-->
<!--                        label-position="left"-->
<!--                        inline-->
<!--                        class="demo-table-expand">-->
<!--                        <el-form-item label="标题">-->
<!--                            <span>{{ props.row.title }}</span>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="路径">-->
<!--                            <span>{{ props.row.path }}</span>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="排序">-->
<!--                            <span>{{ props.row.sort }}</span>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="组件">-->
<!--                            <span>{{ props.row.component }}</span>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="初始菜单">-->
<!--                            <span>{{ props.row.source === 'INIT' ? '是' : '否'}}</span>-->
<!--                        </el-form-item>-->
<!--                    </el-form>-->
<!--                </template>-->
<!--            </el-table-column>-->
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
            handleClick (res) {
                console.log(res);
            },
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
                    // this.arrTable = res || [];
                    this.formatData(res);
                }).toast().finally(() => {
                    typeof callback === 'function' && callback();
                    this.objQuery.isLoading = false;
                });
            },
            // 过滤菜单
            formatData (data = []) {
                let arr = [];
                // 循环得到一级菜单
                data.forEach((item) => !item.father && arr.push(Object.assign(item, { children: [] })));
                arr.forEach((menu) => {
                    data.forEach((item) => {
                        if (menu._id === item.father) {
                            menu.children.push(item);
                        }
                    });
                });
                this.arrTable = arr;
                console.log(this.arrTable)
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

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .main-wrap{
        @extend %df;
        @extend %fdc;
        @extend %df1;
        overflow-y: auto;
        margin-top: 10px;
        text-align: center;
        background-color: #fff;
        padding: 10px;
        border-radius: 4px;
    }
    .custom-tree-node {
        @extend %df;
        @extend %df1;
        @extend %aic;
        font-size: 14px;
        padding-right: 8px;
        span:nth-child(1){
            @extend %df1;
            text-align: left;
        }
    }
</style>
