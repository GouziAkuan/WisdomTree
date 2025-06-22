<script setup>
import { ref, onUnmounted } from 'vue'
import UploadImage from '../UploadImage.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import { addTreeTypeConfig } from '@/common/interfaces/TreeType.interface'
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
  avatar: '',
  scientific_name: '',
  common_name: '',
  description: '',
  total: 1,
  energy: 100
})

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
      // 提交后端
      open()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 弹窗逻辑
const open = () => {
  ElMessageBox.confirm('确定要增加新的树种吗? 同时将自动生成相应数量的树木', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      addTreeType()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 提交后端
const addTreeType = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(addTreeTypeConfig(form.value))
    // 重置表单
    ruleFormRef.value.resetFields()
    uploadEl.value.clearFiles()
    // 关闭加载
    loading.close()
    ElMessage.success(`${res.data.message}`)
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
      <el-input-number v-model="form.total" :min="1" />
    </el-form-item>
    <el-form-item label="所需环保能量" prop="energy">
      <el-input-number v-model="form.energy" :min="1" />
    </el-form-item>
    <el-alert
      title="新建树木成功后，将自动生成相应数量的树木，可前往树木中心查看"
      :closable="false"
      style="margin: 2rem 0"
      type="warning"
      show-icon
    />
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

    <el-button type="primary" @click="submitForm(ruleFormRef)">添加新树种</el-button>
  </el-form>
</template>

<style scoped></style>
