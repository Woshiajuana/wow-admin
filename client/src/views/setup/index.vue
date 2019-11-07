<template>

    <div class="wrap">

        <div class="logo">
            <h1>Wow-Admin</h1>
        </div>

        <div class="inner">
            <el-steps
                class="step-section"
                :active="numCurrent+1"
                align-center>
                <el-step title="设置系统" @click.native="numCurrent = 0"></el-step>
                <el-step title="设置账号" @click.native="handleSure"></el-step>
            </el-steps>
            <el-form
                class="form-section"
                auto-complete="on"
                label-position="left">
                <el-form-item
                    v-for="(item, key) in arrForm[numCurrent]"
                    :key="key">
                    <el-input
                        v-model.trim="item.value"
                        :placeholder="item.placeholder"
                        :type="item.type">
                        <span slot="prefix" class="svg">
                            <svg-icon :icon-class="item.icon" />
                        </span>
                    </el-input>
                </el-form-item>
                <el-button
                    :loading="loading"
                    type="primary"
                    style="width:100%;margin-bottom:30px;"
                    @click.native.prevent="handleSure"
                >{{ numCurrent === arrForm.length - 1 ? '提交' : '下一步' }}</el-button>
            </el-form>
        </div>
    </div>

</template>

<script>
    import Md5                              from 'md5'
    import Mixin                            from './index.mixin'

    export default {
        name: 'SetUp',
        mixins: [
            Mixin,
        ],
        methods: {
            handleSure () {
                if (this.$verify.check(this.arrForm[this.numCurrent]))
                    return null;
                if (this.numCurrent !== this.arrForm.length)
                    return this.numCurrent++;
                let data = this.$verify.input(...this.arrForm);
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
    @import "~@assets/scss/define.scss";
    .wrap{
        @extend %df;
        @extend %fdc;
        @extend %oh;
        @extend %aic;
    }
    .logo{
        @extend %w100;
        @extend %bsb;
        padding: 20px 30px;
        h1 {
            font-size: 18px;
        }
    }
    .step-section{
        margin: 10px 0 20px;
    }
    .inner {
        background-color: #fff;
        border-radius: 6px;
        margin: 50px 0;
        padding: 30px 50px;
        .el-input {
            @extend %dib;
        }
        .el-input--prefix .el-input__inner {
            padding-left: 39px;
        }
    }
    .form-section {
        width: 320px;
        max-width: 100%;
        margin: 0 auto;
        overflow: hidden;
    }
    .svg {
        color: #889aa4;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
</style>
