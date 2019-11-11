<template>

    <div class="wrap">

        <div class="logo">
            <img :src="objAppInfo.logo || objDefAppInfo.logo" alt="logo"/>
            <h1>{{objAppInfo.name || objDefAppInfo.name}}</h1>
        </div>

        <div class="inner">
            <h2>账号登录</h2>
            <el-form
                class="form-section"
                auto-complete="on"
                label-position="left">
                <el-form-item
                    v-for="(item, key) in objForm"
                    :key="key">
                    <el-input
                        v-model.trim="item.value"
                        :maxlength="item.max"
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
                >登录</el-button>
            </el-form>
        </div>

        <div class="flex"></div>

        <p class="ownership">{{objAppInfo.ownership || objDefAppInfo.ownership}}</p>
    </div>

</template>

<script>
    import Md5                              from 'md5'
    import { mapGetters }                   from 'vuex'
    import DataMixin                        from './index.mixin'

    export default {
        name: 'Login',
        mixins: [
            DataMixin,
        ],
        computed: {
            ...mapGetters([ 'objAppInfo', 'objDefAppInfo' ]),
        },
        methods: {
            handleSure () {
                if (this.$verify.check(this.objForm))
                    return null;
                let data = this.$verify.input(this.objForm);
                this.loading = true;
                this.$store.dispatch('user/login', {
                    ...data,
                    password: Md5(data.password.trim()),
                }).then(() => {
                    let redirect = this.$route.query && this.$route.query.redirect;
                    this.$router.push({ path: redirect || '/admin/group' });
                }).toast().finally(() => {
                    this.loading = false;
                });
            },
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
    .inner {
        background-color: #fff;
        border-radius: 6px;
        margin-top: 80px;
        padding: 30px 50px;
        .el-input {
            @extend %dib;
        }
        .el-input--prefix .el-input__inner {
            padding-left: 39px;
        }
        h2{
            @extend %fwn;
            @extend %tac;
            margin: 10px 0 40px;
            font-size: 18px;
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
