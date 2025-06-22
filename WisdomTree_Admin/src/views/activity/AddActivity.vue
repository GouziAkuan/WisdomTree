<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import FromUp from '@/components/activity/FromUp.vue'
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 活动中心 </template>
    <template #two> 新增活动 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
  <FromUp />
</template>

<style scoped></style> 
