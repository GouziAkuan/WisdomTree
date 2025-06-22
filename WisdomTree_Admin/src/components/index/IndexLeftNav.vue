<script setup></script>

<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="/admindataChart"
    text-color="#fff"
    router
  >
    <!-- 数据分析 -->
    <el-menu-item index="/admindataChart">
      <el-icon><TrendCharts /></el-icon>
      <span>可视化工作台</span>
    </el-menu-item>
    <!-- 树种中心 -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Briefcase /></el-icon>
        <span>树种中心</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="2-1" route="/adminTreeType/treeTypeCenter">树种管理</el-menu-item>
        <el-menu-item index="2-2" route="/adminTreeType/addTreeType">新增树种</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <!-- 树木中心 -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon><Menu /></el-icon>
        <span>树木中心</span>
      </template>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="3-1" route="/adminTree/treeCenter">树木管理</el-menu-item>
        <el-menu-item index="3-2" route="/adminTree/addTree">新增树木</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <!-- 领养中心 -->
    <el-sub-menu index="4">
      <template #title>
        <el-icon><List /></el-icon>
        <span>领养中心</span>
      </template>
      <el-menu-item-group title="Group Three">
        <el-menu-item index="4-1" route="/adminAdopt/adoptCenter">领养管理</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <el-icon><Flag /></el-icon>
        <span>活动中心</span>
      </template>
      <el-menu-item-group title="Group Four">
        <el-menu-item index="5-1" route="/adminActivity/activityCenter">活动管理</el-menu-item>
        <el-menu-item index="5-2" route="/adminActivity/addActivity">新增活动</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <!-- 3D模型可视化 -->
    <el-sub-menu index="6">
      <template #title>
        <el-icon><Platform /></el-icon>
        <span>3D模型可视化</span>
      </template>
      <el-menu-item-group title="Group Five">
        <el-menu-item index="6-1" route="/admin3dModel">领养区域3D模型</el-menu-item>
        <el-menu-item index="6-1" route="/TreeModel">养护树木3D模型</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
}
</style>
