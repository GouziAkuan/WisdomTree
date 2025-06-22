<script setup>
import { watch, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { deleteAdoptConfig } from '@/common/interfaces/Adopt.interface'
import router from '@/router'

const tableRef = ref()
const tableData = ref([])

// 树类筛选数据
const treeListFilter = ref([])

// 子传父
const emit = defineEmits(['handleDelete'])

// 子接受父组件数据
const props = defineProps({
  listData: Array,
  treeFilterFather: Array
})

// 监听树类筛选数据，赋值给子组件
watch(
  () => props.treeFilterFather,
  (newVal) => {
    // 当接收到新的数据时
    treeListFilter.value = newVal.map((item) => {
      return {
        text: item,
        value: item
      }
    })
  },
  { immediate: true } // 立即执行，以便在组件初始化时就能对接收到的数据做出响应
)

// 表格数据
// 监听props中的listData数据变化
watch(
  () => props.listData,
  (newVal) => {
    // 当接收到新的数据时
    tableData.value = newVal
  },
  { immediate: true } // 立即执行，以便在组件初始化时就能对接收到的数据做出响应
)

// 树木筛选
const TreeFilter = (value, row, column) => {
  const property = column['property']
  console.log(property)
  return row[property] === value
}

// 重置所有筛选条件
const clearFilter = () => {
  tableRef.value.clearFilter()
}

// 删除领养
const handleDelete = (index, row) => {
  open(row.id)
}

// 弹窗逻辑
const open = (AdoptID) => {
  ElMessageBox.confirm('确定要删除领养表吗?删除后不可恢复', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteAdopt(AdoptID)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 删除请求后端
const deleteAdopt = async (AdoptID) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 后端请求删除领养表
    const res = await requestWithRetry(deleteAdoptConfig(AdoptID))
    console.log(res)
    loading.close()
    //删除成功后，重新请求数据
    emit('handleDelete')

    ElMessage({
      type: 'success',
      message: `${res.data.message}`
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
    path: '/adminAdopt/updateAdopt',
    query: { AdoptID: row.id }
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
    <el-button @click="clearFilter" style="margin-top: 2rem">重置所有筛选条件</el-button>
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
            <h3>领养愿望</h3>
            <p>{{ scope.row.wish }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="领养用户" prop="username" />
      <el-table-column label="领养编号">
        <template #default="scope">
          <el-tag size="large">{{ scope.row.adoption_id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="树种名称"
        prop="scientific_name"
        :filters="treeListFilter"
        :filter-method="TreeFilter"
      >
        <template #default="scope">
          <el-tag size="large" type="warning">{{ scope.row.scientific_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="领养类型" prop="tree_type" />
      <el-table-column label="领养区域" prop="area" />
      <el-table-column label="详情图片">
        <template #default="scope">
          <el-col class="treeImge-el">
            <div class="treeImge-box" v-for="(item, index) in scope.row.detailImage" :key="index">
              <el-image
                class="treeImge"
                :preview-teleported="true"
                :preview-src-list="scope.row.detailImage"
                :src="item"
                :initial-index="index"
                fit="cover"
                loading="lazy"
              />
            </div>
            <!-- 空div -->
            <div class="empty-div"></div>
          </el-col>
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
@import url('/src/assets/css/AdoptTable.css');
</style>
