<template>
    <div id="app" :style="{ background: 'url(' + (objAppInfo.bg || objDefAppInfo.bg || objDefAppInfo.defBg) + ') center center no-repeat' }">
        <router-view class="view-wrap" :style="{ backgroundColor: (objAppInfo.color || objDefAppInfo.color || objDefAppInfo.deColor) }"/>
    </div>
</template>

<script>
    import { mapGetters }                   from 'vuex'

    export default {
        name: 'App',
        computed: {
            ...mapGetters([ 'objAppInfo', 'objDefAppInfo' ]),
        },
    }
</script>

<style lang="scss">
    @import "~@assets/scss/define.scss";

    #app{
        background-size: cover !important;
        background-attachment: fixed !important;
        height: 100%;
        overflow-y: auto;
    }
    .view-wrap {
        min-height: 100%;
    }
    .el-select.el-select--mini{
        width: 100%;
    }
    .el-popup-parent--hidden .fixed-header {
         padding-right: 0 !important;
    }
    .drawer-view{

        .el-drawer__body{
            @extend %df;
            @extend %fdc;
            padding: 20px;
        }

        .demo-drawer__content{
            @extend %df1;
            @extend %df;
            @extend %h100;
            @extend %fdc;
            @extend %oya;
            form {
                @extend %df1;
            }
        }
        .demo-drawer__footer {
            @extend %df;
            margin-top: 10px;
            button {
                @extend %df1;
            }
        }
        .el-select{
            @extend %w100;
        }
        .el-form-item__label{
            @extend %fwn;
        }
        .el-transfer-panel__item{
            @extend %db;
        }
    }
</style>
