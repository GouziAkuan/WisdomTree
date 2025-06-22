<script setup></script>

<template>
  <!-- 面包屑组件 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '' }">
      <slot name="one">默认一级菜单</slot>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <slot name="two">默认二级菜单</slot>
    </el-breadcrumb-item>
    <el-breadcrumb-item>
      <slot name="three"></slot>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped></style>
