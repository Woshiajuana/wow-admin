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
</style>
