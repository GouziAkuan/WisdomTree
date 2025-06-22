<script setup>
import { ref } from 'vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { getTreeDetailConfig } from '@/common/interfaces/Tree.interface'
import FromUpdateTree from '@/components/tree/FromUpdateTree.vue'

const treeInfo = ref({})

// 获取树木详情
const getTreeTypeInfo = async (treeID) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(getTreeDetailConfig(treeID))
    treeInfo.value = res.data.data
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error('获取树种列表失败')
  }
}

// 获取当前路由
const route = useRoute()

// 从路由中获取查询参数
const treeID = +route.query.treeTypeID

getTreeTypeInfo(treeID)
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 树木中心 </template>
    <template #two> <RouterLink to="/adminTree/treeCenter">树木管理</RouterLink> </template>
    <template #three> 编辑树木 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
  <FromUpdateTree :tree-info="treeInfo" :tree-i-d="treeID" />
</template>

<style scoped></style>
