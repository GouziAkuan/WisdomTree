<script setup>
import logo from '@/assets/images/logo.jpg'
</script>
<template>
  <div class="logo-box">
    <!-- logo部分 -->
    <el-col class="logo-box">
      <el-image :src="logo" class="logo" fit="cover" />
      <h3 class="logo-title">绿影慧领后台管理系统</h3>
    </el-col>
  </div>
</template>
<style scoped>
.logo-box {
  margin: 0.4rem 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.logo {
  width: 5rem;
  height: 5rem;
}

.logo-title {
  font-size: 1.8rem;
}
</style>
