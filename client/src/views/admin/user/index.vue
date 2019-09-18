<template>
    <div class="wrap">
        <filter-view
            :form-data="objInput"
            :button-data="operateData"
        ></filter-view>

        <el-table
            class="inner"
            :data="arrTable"
            stripe
            style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import DataMixin from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
        ],
        created () {
            this.reqTableDataList();
        },
        methods: {
            reqTableDataList () {
                this.$curl(this.$appConst.REQ_USER_LIST, { }).then(() => {

                }).toast();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .inner{
        @extend %bsb;
        padding: 10px;
    }
</style>
