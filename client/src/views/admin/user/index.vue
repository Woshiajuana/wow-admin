<template>
    <div class="wrap">
        <filter-view
            :form-data="objInput"
            :button-data="operateData"
        ></filter-view>

        <el-table
            class="inner"
            :data="arrTable"
            stripe
            style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import DataMixin from './data.mixin'

    export default {
        name: 'AdminUser',
        mixins: [
            DataMixin,
        ],
        computed: {
            ...mapGetters([
                'objAppInfo',
            ]),
        },
        methods: {
            handleLogin() {
                if (this.$verify.check(this.objForm))
                    return null;
                let data = this.$verify.input(this.objForm);
                this.loading = true;
                this.$store.dispatch('user/login', data).then(() => {
                    let redirect = this.$route.query && this.$route.query.redirect;
                    this.$router.push({ path: redirect || '/' });
                }).toast().finally(() => {
                    this.loading = false;
                });
            },
        }
    }
</script>

<style lang="scss" scoped>

    .inner{

    }
</style>
