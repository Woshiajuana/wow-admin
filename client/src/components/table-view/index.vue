<template>
    <div class="wrap"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         v-loading="tableUseLoading && loading">
        <el-table
            size="small"
            :data="tableData"
            stripe
            style="width: 100%">
            <slot></slot>
        </el-table>
        <el-pagination
            size="small"
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
        data () {
            return {
                loading: false,
            }
        },
        props: {
            tableLoading: { default: false },
            tableTotal: { default: 0 },
            tableQuery: { default: {} },
            tableData: { default: [] },
            tableUseLoading: { default: true },
        },
        created () {
            this.loading = this.tableLoading;
        },
        methods: {
            handleEmit (eventName, key, event) {
                this.tableQuery[key] = event;
                this.loading = this.tableUseLoading;
                this.$emit(eventName, () => this.loading = false);
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
