<script setup>
import { ref } from 'vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { getAdoptDetailConfig } from '@/common/interfaces/Adopt.interface'
import FromUpdateAdopt from '@/components/adopt/FromUpdateAdopt.vue'

const AdoptInfo = ref({})

// 获取树木详情
const getAdoptDetail = async (AdoptID) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(getAdoptDetailConfig(AdoptID))
    AdoptInfo.value = res.data.data
    AdoptInfo.value.AdoptID = res.data.data.id
    delete AdoptInfo.value.id
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
const AdoptID = route.query.AdoptID

getAdoptDetail(AdoptID)
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 领养中心 </template>
    <template #two> <RouterLink to="/adminAdopt/adoptCenter">领养管理</RouterLink> </template>
    <template #three> 编辑领养 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
  <FromUpdateAdopt :adopt-info="AdoptInfo" />
</template>

<style scoped></style>
