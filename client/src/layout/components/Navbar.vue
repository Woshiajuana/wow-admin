<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb class="breadcrumb-container" />
        <div class="right-menu">
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="objUserInfo.avatar" class="user-avatar">
                    <span>{{objUserInfo.nickname}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <router-link to="/">
                        <el-dropdown-item>首页</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
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
                this.$confirm('确认退出改账号?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$store.dispatch('user/logout');
                    this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
            float: right;
            height: 100%;

            &:focus {
                outline: none;
            }

            .right-menu-item {
                display: inline-block;
                padding: 0 8px;
                height: 100%;
                font-size: 18px;
                color: #5a5e66;
                vertical-align: text-bottom;

                &.hover-effect {
                    cursor: pointer;
                    transition: background .3s;

                    &:hover {
                        background: rgba(0, 0, 0, .025)
                    }
                }
            }

            .avatar-container {
                margin-right: 30px;

                .avatar-wrapper {
                    @extend %cp;
                    @extend %df;
                    @extend %aic;
                    margin-top: 5px;
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
</style>
