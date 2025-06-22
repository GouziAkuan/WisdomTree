<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import { ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import PaginationEl from '@/components/PaginationEl.vue'
import AdoptTable from '@/components/adopt/AdoptTable.vue'
import { getAdoptListConfig } from '@/common/interfaces/Adopt.interface'
import { getTreeFilterConfig } from '@/common/interfaces/Tree.interface'

// 请求数据
const listData = ref([])

//总数据量 传给分页组件计算
const total = ref(0)

// 筛选的树木值（给表格子组件）
const treeFilter = ref([])

// 获取树种列表
const getAdoptList = async (e) => {
  const { page, pagesize } = e || { page: 1, pagesize: 10 }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 请求接口
    const res = await requestWithRetry(getAdoptListConfig(page, pagesize))
    total.value = res.data.data.total
    listData.value = res.data.data.adoptList
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error('获取领养列表失败')
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

getAdoptList()
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 领养中心 </template>
    <template #two> 领养管理 </template>
  </BreadCrumb>
  <!-- 表格组件 -->
  <AdoptTable
    :list-data="listData"
    :tree-filter-father="treeFilter"
    @handle-delete="getTreeTypeList"
  />
  <!-- 分页组件 -->
  <PaginationEl @pagechange="(e) => getTreeTypeList(e)" :total-father="total" />
</template>

<style scoped></style>
