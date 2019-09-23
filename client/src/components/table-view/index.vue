<template>
    <div class="wrap"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         v-loading="tableUseLoading && tableLoading">
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <slot></slot>
        </el-table>
        <el-pagination
            class="pagination"
            @size-change="handleEmit('refresh', 'numSize', $event)"
            @current-change="handleEmit('refresh', 'numIndex', $event)"
            :current-page="tableQuery.numIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="tableQuery.numSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableQuery.numTotal">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        props: {
            tableLoading: { default: false },
            tableTotal: { default: 0 },
            tableQuery: { default: {} },
            tableData: { default: [] },
            tableUseLoading: { default: true },
        },
        methods: {
            handleEmit (eventName, key, event) {
                this.tableQuery[key] = event;
                this.tableLoading = this.tableUseLoading;
                this.$emit(event, () => this.tableLoading = false);
            },
        },
    }
</script>

<style lang="scss" scoped>
    .wrap{
        text-align: center;
        padding: 10px;
    }
    .pagination{
        margin-top: 20px;
    }
</style>
