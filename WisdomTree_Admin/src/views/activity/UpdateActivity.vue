<script setup>
import { ref } from 'vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import FromUpdate from '@/components/activity/FromUpdate.vue'
import { requestWithRetry } from '@/common/interfaces/request'
import { getActivityAdminDetailConfig } from '@/common/interfaces/activity.interface'

const activityInfo = ref({})

// 获取活动详情
const getActivityInfo = async (activityID) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(getActivityAdminDetailConfig(activityID))
    activityInfo.value = res.data.data
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error('获取活动列表失败')
  }
}

// 获取当前路由
const route = useRoute()

// 从路由中获取查询参数
const activityID = route.query.activityID

getActivityInfo(activityID)
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 活动中心 </template>
    <template #two> <RouterLink to="/adminActivity/activityCenter">活动管理</RouterLink> </template>
    <template #three> 编辑活动 </template>
  </BreadCrumb>
  <!-- 表单组件 -->
  <FromUpdate :activity-info="activityInfo" />
</template>

<style scoped></style>
