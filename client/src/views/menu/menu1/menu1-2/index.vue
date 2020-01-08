<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-2" type="success">
      <router-view />
        <span @click="handleJump">跳转到1-3</span>
    </el-alert>
  </div>
</template>

<script>
    export default {
        methods: {
            handleJump () {
                this.$router.push('/menu/menu1/menu1-3');
            },
        }
    }
</script>
