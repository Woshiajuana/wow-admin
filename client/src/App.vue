<template>
    <div id="app">
        <router-view class="view-wrap"/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="scss">
    #app{
        background: url("./assets/images/bg.jpg") center center no-repeat;
        background-size: cover;
        background-attachment: fixed;
        height: 100%;
        overflow-y: auto;
    }
    .view-wrap {
        min-height: 100%;
        color: #409EFF;
        background-color: rgba(0, 0, 0, .5);
    }
    .el-select.el-select--mini{
        width: 100%;
    }
    .el-popup-parent--hidden .fixed-header {
         padding-right: 0 !important;
    }
</style>
