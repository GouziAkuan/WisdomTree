<script setup>
import { watch, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { deleteTreeConfig } from '@/common/interfaces/Tree.interface'
import deleteFileConfig from '@/common/interfaces/DeleteFile.interface'
import router from '@/router'
import dayjs from 'dayjs'

const tableRef = ref()
const tableData = ref([])

// 子传父
const emit = defineEmits(['handleDelete'])

// 子接受父组件数据
const props = defineProps({
  activitylist: Array
})

// 表格数据
// 监听props中的activitylist数据变化
watch(
  () => props.activitylist,
  (newVal) => {
    // 当接收到新的数据时
    tableData.value = newVal
  },
  { immediate: true } // 立即执行，以便在组件初始化时就能对接收到的数据做出响应
)

// 删除活动
const handleDelete = (index, row) => {
  open(row.id, row.coverImageUrl)
}

// 活动状态筛选
const adoptFilter = (value, row) => {
  return row.status === value
}

// 进度计算
const getProgress = (current, planned) => {
  if (planned === 0) return 0
  return Math.round((current / planned) * 100)
}

// 进度条颜色
const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 状态显示样式
const statusFilter = (status) => {
  switch (status) {
    case '已发布':
      return 'success'
    case '进行中':
      return 'warning'
    case '已结束':
      return 'danger'
    default:
      return 'default'
  }
}

// 弹窗逻辑
const open = (treeTypeID, coverImageUrl) => {
  ElMessageBox.confirm('确定要删除活动吗? 活动图片也将被删除，树种数量信息将更新', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteTreeType(treeTypeID, coverImageUrl)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 删除请求后端
const deleteTreeType = async (treeID, coverImageUrl) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 接口请求
    // 删除服务器文件 删除活动
    const res = await Promise.all([
      coverImageUrl.forEach((item) => requestWithRetry(deleteFileConfig(item))),
      requestWithRetry(deleteTreeConfig(treeID))
    ])
    loading.close()
    //删除成功后，重新请求数据
    emit('handleDelete')
    ElMessage({
      type: 'success',
      message: `${res[1].data.message}`
    })
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error(`${error.response.data.message}`)
  }
}

// 前往编辑
const handleEdit = (index, row) => {
  // 路由跳转传参
  router.push({
    path: '/adminActivity/updateActivity',
    query: { activityID: row.id }
  })
}

// 表格父盒子
const container = ref()

// 动态设置的最大高度
const tableMaxHeight = ref()

// 更新表格最大高度的方法
const updateTableHeight = () => {
  // 获取表格容器高度
  tableMaxHeight.value = container.value.clientHeight * 0.91
}

onMounted(() => {
  updateTableHeight()
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setTimeout(updateTableHeight, 300)
  })
})
</script>

<template>
  <div ref="container" style="height: 92%">
    <el-table
      ref="tableRef"
      :data="tableData"
      style="width: 100%"
      :max-height="tableMaxHeight"
      stripe
      :border="false"
      size="large"
      class="table"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <div class="xq">
            <h3>活动详情</h3>
            <p>{{ scope.row.content }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动标题" prop="title" />
      <el-table-column
        label="活动状态"
        :filters="[
          { text: '已发布', value: '已发布' },
          { text: '进行中', value: '进行中' },
          { text: '已结束', value: '已结束' }
        ]"
        :filter-method="adoptFilter"
      >
        <template #default="scope">
          <el-tag size="large" :type="statusFilter(scope.row.status)">{{
            scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="活动封面">
        <template #default="scope">
          <el-col class="treeImge-el">
            <el-image
              :preview-src-list="[scope.row.coverImageUrl]"
              :preview-teleported="true"
              :src="scope.row.coverImageUrl"
              fit="cover"
              loading="lazy"
          /></el-col>
        </template>
      </el-table-column>
      <el-table-column label="活动时间地点">
        <template #default="scope">
          <div class="time-location">
            <el-tag type="primary" size="small">{{ scope.row.location }}</el-tag>
            <div class="time">
              {{ dayjs(scope.row.startTime).format('MM-DD HH:mm') }}
              ~
              {{ dayjs(scope.row.endTime).format('MM-DD HH:mm') }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="人数进度">
        <template #default="scope">
          <el-progress
            :color="customColors"
            :text-inside="true"
            :stroke-width="18"
            striped
            striped-flow
            :percentage="getProgress(scope.row.currentCapacity, scope.row.plannedCapacity)"
            status="success"
          />
        </template>
      </el-table-column>
      <el-table-column label="相关操作">
        <template #default="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)"> 编辑 </el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
@import url('/src/assets/css/TreeTable.css');
.time {
  color: #666;
  margin-top: 10px;
}
</style>
