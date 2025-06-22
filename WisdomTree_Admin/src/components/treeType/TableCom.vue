<script setup>
import { watch, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { deleteTreeTypeConfig } from '@/common/interfaces/TreeType.interface'
import deleteFileConfig from '@/common/interfaces/DeleteFile.interface'
import router from '@/router'

const tableData = ref([])

// 子传父
const emit = defineEmits(['handleDelete'])

// 子接受父组件数据
const props = defineProps({
  treetypelist: Array
})

// 表格数据
// 监听props中的treetypelist数据变化
watch(
  () => props.treetypelist,
  (newVal) => {
    // 当接收到新的数据时
    tableData.value = newVal
  },
  { immediate: true } // 立即执行，以便在组件初始化时就能对接收到的数据做出响应
)

// 删除树类
const handleDelete = (index, row) => {
  open(row.id, row.avatar)
}

// 弹窗逻辑
const open = (treeTypeID, avatar) => {
  ElMessageBox.confirm('确定要删除树种吗?删除后不可恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteTreeType(treeTypeID, avatar)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 删除请求后端
const deleteTreeType = async (treeTypeID, avatar) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 删除服务器文件 删除树类
    const res = await Promise.all([
      requestWithRetry(deleteFileConfig(avatar)),
      requestWithRetry(deleteTreeTypeConfig(treeTypeID))
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
    path: '/adminTreeType/updateTreeType',
    query: { treeTypeID: row.id }
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
            <h3>树木详情</h3>
            <p>{{ scope.row.description }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="树种学名" prop="scientific_name" />
      <el-table-column label="树种头像">
        <template #default="scope">
          <el-col class="treeImge-el">
            <el-image
              class="avatar"
              :preview-teleported="true"
              :preview-src-list="[scope.row.avatar]"
              :src="scope.row.avatar"
              fit="cover"
              loading="lazy"
          /></el-col>
        </template>
      </el-table-column>
      <el-table-column label="树种俗名" prop="common_name" />
      <el-table-column label="所需能量">
        <template #default="scope">
          <el-tag size="large" type="success">{{ scope.row.energy }}g</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总数">
        <template #default="scope">
          <el-tag size="large">{{ scope.row.total }} 颗</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量">
        <template #default="scope">
          <el-tag size="large" type="warning">{{ scope.row.remaining }} 颗</el-tag>
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
@import url('/src/assets/css/tablecom.css');
</style>
