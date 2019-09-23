<template>
    <div class="wrap">
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <slot></slot>
        </el-table>
        <el-pagination
            class="pagination"
            @size-change="handleEmit('refresh')"
            @current-change="handleEmit('refresh')"
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
            tableTotal: { default: 0 },
            tableQuery: { default: {} },
            tableData: { default: [] },
        },
        methods: {
            handleEmit (event) {
                this.$emit(event);
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
