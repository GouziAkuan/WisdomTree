<script setup>
import { ref } from 'vue'
import { requestWithRetry } from '@/common/interfaces/request'
import { ElMessage } from 'element-plus'

// TODO:defineModel小心得
// 输入框内容
// 使用defineModel实现子父组件双向绑定，官方将其封装好，一句代码搞定
// 在这个组件中，子组件的输入框内容和父组件双向绑定，父组件只需要通过v-model接受，如v-model:form.scientific_name
// 这样当我子组件改变时候，父组件form.value.scientific_name的值会变化
// 但依然遵循单向数据流，子组件的数据还是通过子组件更改，父组件只是通过双向绑定接受值，原理和prop+emit实现双向绑定一致
const state = defineModel({ type: String })

// 父传子
const props = defineProps({
  // 输入框提示
  placeholder: String,
  // 提交后端的搜索方法
  searchMethod: Function
})

// 建议数组
const SearchResult = ref([])

/**
 * 异步查询搜索功能
 * @param {string} queryString - 搜索查询字符串
 * @param {Function} cb - 回调函数，用于处理搜索结果
 */
const querySearchAsync = async (queryString, cb) => {
  // 如果查询字符串为空，则将其设置为空字符串
  if (!queryString) {
    queryString = ''
  }
  try {
    // 发起搜索请求
    const res = await requestWithRetry(props.searchMethod(queryString))
    // 处理搜索结果，将每个搜索项转换为包含 value 属性的对象
    SearchResult.value = res.data.data.map((item) => ({
      value: item
    }))
    // 调用回调函数，传入处理后的搜索结果
    cb(SearchResult.value)
  } catch (error) {
    console.log(error)
    ElMessage.error('搜索错误')
  }
}
</script>

<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    :placeholder="props.placeholder"
  />
</template>

<style scoped></style>
