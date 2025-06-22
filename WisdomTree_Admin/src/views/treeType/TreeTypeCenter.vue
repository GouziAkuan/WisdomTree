<script setup>
import BreadCrumb from '@/components/BreadCrumb.vue'
import TableCom from '@/components/treeType/TableCom.vue'
import { ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { getTreeTypetConfig } from '@/common/interfaces/TreeType.interface'
import PaginationEl from '@/components/PaginationEl.vue'

const TreeTypeListData = ref([])

const total = ref(0)

// 获取树种列表
const getTreeTypeList = async (e) => {
  const { page, pagesize } = e || { page: 1, pagesize: 10 }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    // 请求接口
    const res = await requestWithRetry(getTreeTypetConfig(page, pagesize))
    total.value = res.data.data.total
    TreeTypeListData.value = res.data.data.treeTypeList
    loading.close()
  } catch (error) {
    console.log(error)
    loading.close()
    ElMessage.error('获取树种列表失败')
  }
}

getTreeTypeList()
</script>

<template>
  <!-- 面包屑组件 -->
  <BreadCrumb>
    <template #one> 树种中心 </template>
    <template #two> 树种管理 </template>
  </BreadCrumb>
  <!-- 表格组件 -->
  <TableCom :treetypelist="TreeTypeListData" @handle-delete="getTreeTypeList" />
  <!-- 分页组件 -->
  <PaginationEl @pagechange="(e) => getTreeTypeList(e)" :total-father="total" />
</template>

<style scoped></style>
