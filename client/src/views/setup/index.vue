<template>
    <div class="login-container">
        <el-form
            class="login-form"
            auto-complete="on"
            label-position="left">
            <div class="title-container">
                <h3 class="title">请先设置 APP</h3>
            </div>
            <el-form-item
                v-for="(item, key) in objForm"
                :key="key">
                <span class="svg-container">
                    <svg-icon :icon-class="item.icon" />
                </span>
                <el-input
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    :type="item.type"
                    tabindex="1"
                    auto-complete="on"
                ></el-input>
            </el-form-item>
            <el-button
                :loading="loading"
                type="primary"
                style="width:100%;margin-bottom:30px;"
                @click.native.prevent="handleLogin"
            >提交</el-button>
        </el-form>
    </div>
</template>

<script>
    import Md5 from 'md5'
    import Mixin from './index.mixin'
    export default {
        name: 'SetUp',
        mixins: [
            Mixin,
        ],
        methods: {
            handleLogin () {
                if (this.$verify.check(this.objForm))
                    return null;
                let data = this.$verify.input(this.objForm);
                this.loading = true;
                this.$curl(this.$appConst.DO_APP_INIT, {
                    ...data,
                    password: Md5(data.password.trim()),
                }).then(() => {
                    this.$router.push('/');
                }).toast().finally(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>

<style lang="scss">

    $bg:#283443;
    $light_gray:#fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>

<style lang="scss" scoped>
    $bg:#2d3a4b;
    $dark_gray:#889aa4;
    $light_gray:#eee;

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: #fff;
        overflow: hidden;

        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 60px 35px 0;
            margin: 0 auto;
            overflow: hidden;
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 40px auto;
                text-align: center;
                font-weight: bold;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }
    }
</style>
