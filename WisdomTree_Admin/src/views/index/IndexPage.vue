<script setup>
import IndexLeftNav from '@/components/index/IndexLeftNav.vue'
import IndexLogo from '@/components/index/IndexLogo.vue'
</script>

<template>
  <div class="page">
    <el-row class="all">
      <!-- 左边 -->
      <el-col class="page-left-nav" :span="4">
        <!-- logo组件 -->
        <IndexLogo />
        <el-col class="left-nav">
          <!-- 左边导航栏组件 -->
          <IndexLeftNav />
        </el-col>
      </el-col>
      <el-col class="page-right" :span="20">
        <!-- 提示栏 -->
        <el-alert
          title="注意数据一旦删除无法找回！"
          type="info"
          description="根据提示正确完成操作！"
          show-icon
          :closable="false"
        />
        <el-col class="page-right-content">
          <!-- 二级路由出口 -->
          <RouterView />
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
@import url('/src/assets/css/index.css');
</style>
