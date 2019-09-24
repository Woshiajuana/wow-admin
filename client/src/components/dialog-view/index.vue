
<template>
    <el-dialog
        :title="dialog_title"
        :visible.sync="dialog_visible"
        :before-close="handleClose">
        <slot></slot>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialog_title: { default: '' },
            dialog_visible: { default: false },
            dialog_width: { default: '' },
        },
        methods: {
            handleClose () {
                this.$emit('update:dialog_visible', false);
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>
