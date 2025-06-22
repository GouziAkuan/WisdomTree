<script setup>
import { ref, watch } from 'vue'

// 父传子 总数据量
const props = defineProps({
  totalFather: Number,
})
// 子传父
const emit = defineEmits(['pagechange'])

// 总数据量
const total = ref(0)
// 每页的数据量
const pagesize = 10
// 当前页码
const currentPage = ref(1)

// 监听总数据量变化，赋值给子组件，重新计算分页
watch(
  () => props.totalFather,
  (newTotal) => {
    total.value = newTotal
  }
)

// 监听当前页码变化，重新计算分页
watch(currentPage, (currentPage) => {
  // 传两个参数给父组件
  emit('pagechange', { page: currentPage, pagesize })
})
</script>

<template>
  <el-col>
    <div style="width: 100%; display: flex; justify-content: center; margin-top: 2.5rem">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        v-model:current-page="currentPage"
        :hide-on-single-page="true"
      />
    </div>
  </el-col>
</template>

<style scoped>
/* 可以在这里添加样式 */
</style>
