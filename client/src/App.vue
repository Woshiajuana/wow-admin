<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="scss">
    #app{
        background: url("./assets/images/bg.jpg") center top no-repeat;
        background-size: auto 100%;

    }
    .app-main{
        /*background-color: #f2f2f2;*/
    }

    .el-select.el-select--mini{
        width: 100%;
    }
    .el-popup-parent--hidden .fixed-header {
         padding-right: 0 !important;
    }
</style>
