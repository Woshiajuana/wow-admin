<template>

    <div class="wrap">

        <div class="logo">
            <img :src="arrForm[0].logo.value || objDefAppInfo.logo" alt="logo"/>
            <h1>{{arrForm[0].name.value || objDefAppInfo.name}}</h1>
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

        <div class="flex">{{objDefAppInfo}}</div>

        <p class="ownership">{{arrForm[0].ownership.value || objDefAppInfo.ownership}}</p>
    </div>

</template>

<script>
    import Md5                              from 'md5'
    import { mapGetters }                   from 'vuex'
    import Mixin                            from './index.mixin'

    export default {
        name: 'SetUp',
        mixins: [
            Mixin,
        ],
        watch: {
            'arrForm.0.color.value' (value) {
                this.$store.commit('app/SET_DEF_APP_INFO', { color: value });
            },
            'arrForm.0.bg.value' (value) {
                this.$store.commit('app/SET_DEF_APP_INFO', { bg: value });
            }
        },
        computed: {
            ...mapGetters([ 'objAppInfo', 'objDefAppInfo' ]),
        },
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
        color: #409EFF;
    }
    .logo{
        @extend %w100;
        @extend %df;
        @extend %aic;
        @extend %bsb;
        padding: 10px 20px;
        h1 {
            font-size: 18px;
        }
        img {
            width: 60px;
            height: 60px;
            margin-right: 10px;
        }
    }
    .step-section{
        margin: 10px 0 20px;
    }
    .inner {
        background-color: #fff;
        border-radius: 6px;
        margin-top: 40px;
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
    .flex{
        @extend %df1;
    }
    .svg {
        color: #889aa4;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
    .ownership{
        font-size: 12px;
        color: #ddd;
    }
</style>
