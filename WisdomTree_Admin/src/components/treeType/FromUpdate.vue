<script setup>
import { ref, watch, onUnmounted } from 'vue'
import UploadImage from '../UploadImage.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { updateTreeTypeConfig } from '@/common/interfaces/TreeType.interface'
import router from '@/router'
import deleteFileConfig from '@/common/interfaces/DeleteFile.interface'

// 表单实例
const ruleFormRef = ref()

// 上传子组件实例
const uploadEl = ref()

// 上传图片的限制
const limit = ref(1)

// 需要删除的图片
const deleteImages = ref([])

// 表单数据
const form = ref({
  treeTypeID: 0,
  avatar: '',
  scientific_name: '',
  common_name: '',
  description: '',
  total: 0,
  remaining: 0,
  energy: 0
})

// 总数数量最小值不能小于最开始的剩余数量（因为涉及到领养数据）
let totalInputMin = 1

// 当total变化时 处理remaining
const totalChange = (currentValue, oldValue) => {
  const diffnum = currentValue - oldValue
  form.value.remaining += diffnum
}

// 父传子
const props = defineProps({
  treeTypeInfo: Object
})

// 监视父组件传来的树种信息
watch(
  () => props.treeTypeInfo,
  (newValue) => {
    form.value = newValue
    // 设置totalInputMin（如果存在领养数据）
    if (form.value.total !== form.value.remaining) {
      totalInputMin = form.value.remaining
    }
  },
  { immediate: true }
)

// 表单规则
const rules = ref({
  avatar: [{ required: true, message: '请上传树木头像', trigger: 'blur' }],
  scientific_name: [{ required: true, message: '请输入树木学名', trigger: 'blur' }],
  common_name: [
    { required: true, message: '请输入树木俗名', trigger: 'blur' },
    { max: 7, message: '字数不超过7', trigger: 'blur' }
  ],
  description: [{ required: true, message: '请输入树木介绍', trigger: 'blur' }],
  total: [
    { required: true, message: '请输入树木总数', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  remaining: [
    { required: true, message: '请输入树木剩余数量', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  energy: [
    { required: true, message: '请输入所需环保能量', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ]
})

// 提交表单
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      // 出现弹窗
      open()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 弹窗逻辑
const open = () => {
  ElMessageBox.confirm('确定要修改树种信息吗? 树木可能将重新进行计算', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      updateTreeTypeType()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 提交后端
const updateTreeTypeType = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(updateTreeTypeConfig(form.value))
    // 重置表单
    ruleFormRef.value.resetFields()
    uploadEl.value.clearFiles()
    // 关闭加载
    loading.close()
    ElMessage.success(`${res.data.message}`)
    // 跳转到树种管理页面
    router.push('/adminTreeType')
  } catch (error) {
    loading.close()
    console.log(error)
    ElMessage.error(`${error.response.data.message}`)
  }
}

// 取消挂载时 删除图片
onUnmounted(() => {
  deleteImages.value.forEach(async (item) => {
    // 删除图片
    await requestWithRetry(deleteFileConfig(item))
  })
})
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :rules="rules"
    :model="form"
    label-width="auto"
    label-position="top"
    size="large"
    style="max-width: 60rem; margin-top: 2rem"
  >
    <el-form-item label="树木学名" prop="scientific_name">
      <el-input v-model="form.scientific_name" placeholder="输入树木学名" />
    </el-form-item>
    <el-form-item label="树木俗名" prop="common_name">
      <el-input v-model="form.common_name" placeholder="输入树木俗名" />
    </el-form-item>
    <el-form-item label="树木总数" prop="total">
      <el-input-number v-model="form.total" :min="totalInputMin" @change="totalChange" />
    </el-form-item>
    <el-form-item label="树木剩余数量" prop="remaining">
      <el-input-number :disabled="true" v-model="form.remaining" />
    </el-form-item>
    <el-alert
      title="修改成功后树木对应的数量会被自动重新计算，可能导致树木图片丢失（减少操作），请谨慎操作！推荐前往树木中心对树木进行操作"
      :closable="false"
      style="margin: 2rem 0"
      type="warning"
      show-icon
    />
    <el-form-item label="所需环保能量" prop="energy">
      <el-input-number v-model="form.energy" :min="1" />
    </el-form-item>
    <el-form-item label="树木介绍" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        placeholder="输入树木介绍"
        :autosize="{ minRows: 4 }"
      />
    </el-form-item>
    <el-form-item label="树木头像" prop="avatar">
      <UploadImage
        ref="uploadEl"
        :limit-father="limit"
        :oneImage="form.avatar"
        @addSucess="
          (e) => {
            form.avatar = e
          }
        "
        @deleteSucess="
          (e) => {
            form.avatar = e
          }
        "
        @deleteImgaes="
          (e) => {
            deleteImages.push(e)
          }
        "
      />
    </el-form-item>

    <el-button type="primary" @click="submitForm(ruleFormRef)">修改树种信息</el-button>
  </el-form>
</template>

<style scoped></style>
