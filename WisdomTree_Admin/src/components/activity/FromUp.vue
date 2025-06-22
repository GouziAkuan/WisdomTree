<script setup>
import { ref, onUnmounted } from 'vue'
import UploadImage from '../UploadImage.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import deleteFileConfig from '@/common/interfaces/DeleteFile.interface'
import { publishActivityConfig } from '@/common/interfaces/activity.interface'

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
  title: '',
  coverImageUrl: '',
  location: '',
  content: '',
  plannedCapacity: 1,
  startTime: '',
  endTime: '',
  time: [] // 临时存储日期时间范围
})

// 处理日期时间范围选择器的值变化
const handleTimeChange = (value) => {
  if (value && value.length === 2) {
    form.value.startTime = value[0] // 开始时间
    form.value.endTime = value[1] // 结束时间
  } else {
    form.value.startTime = '' // 清空开始时间
    form.value.endTime = '' // 清空结束时间
  }
}

// 表单规则
const rules = ref({
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur' },
    { max: 20, message: '活动标题不能超过20个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' },
    { max: 20, message: '活动地点不能超过20个字符', trigger: 'blur' }
  ],
  plannedCapacity: [
    { required: true, message: '请输入活动人数', trigger: 'blur' },
    { type: 'number', min: 1, message: '活动人数必须大于0', trigger: 'blur' }
  ],
  time: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value || value.length !== 2) {
          callback(new Error('请选择活动时间范围'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  content: [{ required: true, message: '请输入活动介绍', trigger: 'blur' }],
  coverImageUrl: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请上传活动封面'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
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
  ElMessageBox.confirm('确定要增加新的新活动吗?', '提示', {
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
    const res = await requestWithRetry(publishActivityConfig(form.value))
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
    <el-form-item label="活动标题" prop="title">
      <el-input v-model="form.title" placeholder="输入活动标题" />
    </el-form-item>
    <el-form-item label="活动地点" prop="location">
      <el-input v-model="form.location" placeholder="输入活动地点" />
    </el-form-item>
    <el-form-item label="活动人数" prop="plannedCapacity">
      <el-input-number v-model="form.plannedCapacity" :min="1" />
    </el-form-item>
    <!-- 活动时间段 -->
    <el-form-item label="活动时间" prop="time">
      <el-date-picker
        v-model="form.time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleTimeChange"
      />
    </el-form-item>
    <el-form-item label="活动介绍" prop="content">
      <el-input
        v-model="form.content"
        type="textarea"
        placeholder="输入活动介绍"
        :autosize="{ minRows: 4 }"
      />
    </el-form-item>
    <el-form-item label="活动封面" prop="coverImageUrl">
      <UploadImage
        ref="uploadEl"
        :limit-father="limit"
        @addSucess="
          (e) => {
            form.coverImageUrl = e
          }
        "
        @deleteSucess="
          (e) => {
            form.coverImageUrl = e
          }
        "
        @deleteImgaes="
          (e) => {
            deleteImages.push(e)
          }
        "
      />
    </el-form-item>

    <el-button type="primary" @click="submitForm(ruleFormRef)">添加新活动</el-button>
  </el-form>
</template>

<style scoped></style>
