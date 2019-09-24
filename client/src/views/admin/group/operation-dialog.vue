<template>
        <el-dialog
            :title="operation_title"
            :visible.sync="operation_visible"
            :before-close="handleClose">
            <el-row>

            </el-row>
            <el-row type="flex" justify="center">
                <el-button
                    @click="submit"
                    size="medium"
                    type="primary"
                    :loading="loading"
                >保存</el-button>
                <el-button
                    @click="close"
                    size="medium"
                >关闭</el-button>
            </el-row>
        </el-dialog>
</template>

<script>

    export default {
        data () {
            return {
                loading: false,
            }
        },
        props: {
            operation_title: { default: '' },
            operation_visible: { default: false },
            operation_width: { default: '' },
        },
        methods: {
            handleClose () {
                this.$emit('update:operation_visible', false);
            },
        },
    };
</script>

<style>


</style>
