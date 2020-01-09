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
            height: 300px;
        }

        .demo-drawer__content{
            @extend %df1;
            @extend %df;
            @extend %h100;
            @extend %fdc;
            @extend %oya;
            padding: 0 20px;
            form {
                @extend %df1;
            }
        }
        .demo-drawer__footer {
            @extend %df;
            margin-top: 10px;
            padding: 0 20px 20px;
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
        .el-transfer-panel__filter{
            margin: 5px 15px 0;
        }
    }
    .el-table__expanded-cell{
        padding: 10px 58px !important;
    }
    .demo-table-expand {
        font-size: 0;
        label {
            @extend %fwn;
            width: 90px;
            color: #99a9bf;
            font-size: 12px;
        }
        span {
            font-size: 12px;
        }
        .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
            font-size: 12px;
        }
    }
    /*.drawer-bg{*/
    /*    z-index: 3000 !important;*/
    /*}*/
    /*.sidebar-container{*/
    /*    z-index: 3001 !important;*/
    /*}*/
    /*.v-modal{*/
    /*    z-index: 3002 !important;*/
    /*}*/
    /*.el-message-box__wrapper{*/
    /*    z-index: 3003 !important;*/
    /*}*/
</style>
