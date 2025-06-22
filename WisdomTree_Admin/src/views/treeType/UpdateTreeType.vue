<script setup>
import { ref } from 'vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import FromUpdate from '@/components/treeType/FromUpdate.vue'
import { requestWithRetry } from '@/common/interfaces/request'
import { getTreeTypeDeailConfig } from '@/common/interfaces/TreeType.interface'

const treeTypeInfo = ref({})

// 获取树木详情
const getTreeTypeInfo = async (treeTypeID) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(getTreeTypeDeailConfig(treeTypeID))
    treeTypeInfo.value = res.data.data
    treeTypeInfo.value.treeTypeID = res.data.data.id
    delete treeTypeInfo.value.id
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
const treeTypeID = route.query.treeTypeID

getTreeTypeInfo(treeTypeID)
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 树种中心 </template>
    <template #two> <RouterLink to="/adminTreeType/treeTypeCenter">树种管理</RouterLink> </template>
    <template #three> 编辑树种 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
  <FromUpdate :tree-type-info="treeTypeInfo" :tree-type-id="treeTypeID" />
</template>

<style scoped></style>
