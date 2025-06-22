<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import { ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import PaginationEl from '@/components/PaginationEl.vue'
import ActivityTable from '@/components/activity/ActivityTable.vue'
import dayjs from 'dayjs'
import { getActivityAdminListConfig } from '@/common/interfaces/activity.interface'

// 数据量总数（给分页子组件）
const total = ref(0)

const ActivityData = ref([
  {
    id: 1,
    title: '春季植树活动',
    coverImageUrl:
      'https://www.sznews.com/tech/pic/2021-03/13/6d48bfca-f026-444f-ad69-018c211a52b8.jpeg',
    startTime: '2025-03-01 10:00:00',
    endTime: '2025-03-05 18:00:00',
    location: '城市中央公园',
    plannedCapacity: 100,
    currentCapacity: 75,
    content: '活动详情',
    status: '进行中'
  }
])

// 活动状态计算
const getActivityStatus = (start, end) => {
  const now = dayjs()
  const startDate = dayjs(start)
  const endDate = dayjs(end)

  if (now.isBefore(startDate)) return '已发布'
  if (now.isAfter(endDate)) return '已结束'
  return '进行中'
}

// 获取活动列表
const getActivityList = async (e) => {
  const { page, pagesize } = e || { page: 1, pagesize: 10 }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 请求接口
    const res = await requestWithRetry(getActivityAdminListConfig(page, pagesize))
    ActivityData.value = res.data.data.activities
    ActivityData.value.forEach((item) => {
      item.status = getActivityStatus(item.startTime, item.endTime)
    })
    total.value = res.data.data.total
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error('获取活动列表失败')
  }
}

getActivityList()
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 活动中心 </template>
    <template #two> 活动管理 </template>
  </BreadCrumb>
  <!-- 表格组件 -->
  <ActivityTable :activitylist="ActivityData" @handle-delete="getActivityList" />
  <!-- 分页组件 -->
  <PaginationEl @pagechange="(e) => getActivityList(e)" :total-father="total" />
</template>

<style scoped></style>
