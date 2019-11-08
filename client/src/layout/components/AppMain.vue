<template>
    <section class="app-main">
<!--        <transition name="fade-transform" mode="out-in">-->
            <router-view :key="key" class="app-inner" />
<!--        </transition>-->
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        computed: {
            key() {
                return this.$route.path
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-main {
        min-height: calc(100vh - 50px);
        width: 100%;
        position: relative;
        overflow: hidden;
        background-color: rgba(255, 255, 255, .7);
        height: 100%;
    }
    .fixed-header+.app-main {
        padding-top: 50px;
    }

    .hasTagsView {
        .app-main {
            min-height: calc(100vh - 84px);
            height: 100%;
        }

        .fixed-header+.app-main {
            padding-top: 84px;
        }
    }
</style>

<style lang="scss">
    @import "~@assets/scss/define.scss";
    .el-popup-parent--hidden {
        .fixed-header {
            padding-right: 15px;
        }
    }
    .app-inner{
        @extend %h100;
        @extend %df;
        @extend %fdc;
        padding: 10px;
    }
</style>
