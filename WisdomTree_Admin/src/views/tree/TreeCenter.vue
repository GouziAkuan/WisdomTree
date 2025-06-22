<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import TreeTable from '@/components/tree/TreeTable.vue'
import { ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import PaginationEl from '@/components/PaginationEl.vue'
import { getTreeListConfig } from '@/common/interfaces/Tree.interface'
import { getTreeFilterConfig } from '@/common/interfaces/Tree.interface'

const TreeTypeListData = ref([])

// 数据量总数（给分页子组件）
const total = ref(0)

// 筛选的树木值（给表格子组件）
const treeFilter = ref([])

// 获取树种列表
const getTreeList = async (e) => {
  const { page, pagesize } = e || { page: 1, pagesize: 10 }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 请求接口
    const res = await requestWithRetry(getTreeListConfig(page, pagesize))
    TreeTypeListData.value = res.data.data.treeList
    total.value = res.data.data.total
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error('获取树种列表失败')
  }
}

// 获取筛选条件树种列表
const getTreeFilter = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(getTreeFilterConfig())
    treeFilter.value = res.data.data
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
  }
}

getTreeFilter()

getTreeList()
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 树木中心 </template>
    <template #two> 树木管理 </template>
  </BreadCrumb>
  <!-- 表格组件 -->
  <TreeTable
    :treetypelist="TreeTypeListData"
    :tree-filter-father="treeFilter"
    @handle-delete="getTreeList"
  />
  <!-- 分页组件 -->
  <PaginationEl @pagechange="(e) => getTreeList(e)" :total-father="total" />
</template>

<style scoped></style>
