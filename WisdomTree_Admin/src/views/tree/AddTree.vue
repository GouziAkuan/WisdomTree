<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import FromAdd from '@/components/tree/FromAdd.vue';
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 树木中心 </template>
    <template #two> 新增树木 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
   <FromAdd />
</template>

<style scoped></style>
