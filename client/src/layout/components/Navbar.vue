<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb class="breadcrumb-container" />
        <div class="right-menu">

            <el-tooltip content="全屏" effect="dark" placement="bottom">
                <screenfull id="screenfull" class="right-menu-item hover-effect" />
            </el-tooltip>

            <el-tooltip content="设置中心" effect="dark" placement="bottom">
                <div class="right-menu-item hover-effect">
                    <router-link to="/other/setting">
                        <svg-icon class="icon-size" icon-class="el-icon-s-tools"></svg-icon>
                    </router-link>
                </div>
            </el-tooltip>

            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="objUserInfo.avatar" class="user-avatar">
                    <span>{{objUserInfo.nickname}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <router-link to="/other/center">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item>
                        <span style="display:block;" @click="logout">安全退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Breadcrumb from '@layout/components/Breadcrumb'
    import Hamburger from '@layout/components/Hamburger'

    export default {
        components: {
            Breadcrumb,
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'objUserInfo',
            ]),
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                this.$confirm('确认退出该账号?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$store.dispatch('user/logout');
                }).null();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@assets/scss/define.scss";
    .navbar {
        height: 50px;
        overflow: hidden;
        position: relative;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0,21,41,.08);

        .hamburger-container {
            line-height: 46px;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background .3s;
            -webkit-tap-highlight-color:transparent;

            &:hover {
                background: rgba(0, 0, 0, .025)
            }
        }

        .breadcrumb-container {
            float: left;
        }
        .right-menu {
            @extend %df;
            @extend %aic;
            float: right;
            height: 100%;
            &:focus {
                outline: none;
            }
            .right-menu-item {
                @extend %df;
                @extend %aic;
                @extend %jcc;
                padding: 0 8px;
                height: 100%;
                font-size: 18px;
                color: #5a5e66;
                *{
                    @extend %db;
                }
                &.hover-effect {
                    cursor: pointer;
                    transition: background .3s;
                    &:hover {
                        background: rgba(0, 0, 0, .025)
                    }
                }
            }
            .avatar-container {
                @extend %h100;
                padding: 0 30px 0 10px;
                .avatar-wrapper {
                    @extend %cp;
                    @extend %df;
                    @extend %aic;
                    @extend %h100;
                    position: relative;
                    span{
                        font-size: 20px;
                    }
                    .user-avatar {
                        margin-right: 10px;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                    }

                    .el-icon-caret-bottom {
                        cursor: pointer;
                        position: absolute;
                        right: -20px;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .icon-size{
        /*width: 22px !important;*/
        /*height: 22px !important;*/
        font-size: 22px;
        color: #595d66;
        &.el-svg-icon{
            margin-right: 0 !important;
        }
    }
</style>
