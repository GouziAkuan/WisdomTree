<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import FromUp from '@/components/treeType/FromUp.vue'
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 树种中心 </template>
    <template #two> 新增树种 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
  <FromUp />
</template>

<style scoped></style>
