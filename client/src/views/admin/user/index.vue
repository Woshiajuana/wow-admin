<template>
    <div class="wrap">
        <span>管理员用户列表</span>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'AdminUser',
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

</style>
