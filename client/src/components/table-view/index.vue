<template>
    <div class="table-view">
        <div class="table-section"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             v-loading="tableQuery.isLoading">
            <el-table
                class="table"
                size="mini"
                :data="tableData"
                height="100"
                stripe
                style="width: 100%">
                <slot></slot>
            </el-table>
        </div>
        <el-pagination
            size="mini"
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
                if (key === 'numSize') {
                    this.tableQuery.numIndex = 1;
                }
                this.tableQuery[key] = event;
                this.$emit(eventName);
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .table-view{
        @extend %df;
        @extend %fdc;
        @extend %df1;
        margin-top: 10px;
        text-align: center;
        .table-section{
            @extend %df1;
            @extend %df;
            @extend %fdc;
            background-color: #fff;
            padding: 10px 10px 0;
            border-radius: 4px;
        }
        .table{
            @extend %df1;
            @extend %h100;
        }
        .pagination{
            margin-top: 10px;
            padding: 10px 0;
            border-radius: 4px;
            background-color: #fff;
        }
    }

</style>
