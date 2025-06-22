<script setup>
import { ref, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import UploadImage from '../UploadImage.vue'
import { addTreesConfig } from '@/common/interfaces/Tree.interface'
import SearchInput from '../SearchInput.vue'
import { searchTreeTypeConfig } from '@/common/interfaces/Tree.interface'
import deleteFileConfig from '@/common/interfaces/DeleteFile.interface'

// 表单实例
const ruleFormRef = ref()

// 上传子组件实例
const uploadEl = ref()

// 上传图片的限制
const limit = ref(6)

// 需要删除的图片
const deleteImages = ref([])

// 表单数据
const form = ref({
  treeType: '',
  detailImage: []
})

// 表单规则
const rules = ref({
  treeType: [{ required: true, message: '请输入树种名称', trigger: 'blur' }],
  detailImage: [{ required: true, message: '请上传树木详情图片', trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      open()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 弹窗逻辑
const open = () => {
  ElMessageBox.confirm('确定要增加新的树木吗? 同时将自动更改树种相关信息', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      addTrees()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 提交后端
const addTrees = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(addTreesConfig(form.value))
    // 重置表单
    ruleFormRef.value.resetFields()
    uploadEl.value.clearFiles()
    // 关闭加载
    loading.close()
    ElMessage.success(`${res.data.message}`)
  } catch (error) {
    console.log(error)
    loading.close()
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
    <el-form-item label="树种名字" prop="treeType">
      <SearchInput
        v-model="form.treeType"
        :placeholder="'请输入树种名称'"
        :search-method="searchTreeTypeConfig"
      />
    </el-form-item>
    <el-alert
      title="请输入已有树种名称"
      :closable="false"
      style="margin: 2rem 0"
      type="warning"
      show-icon
    />
    <el-form-item label="树木详情图片" prop="detailImage">
      <UploadImage
        ref="uploadEl"
        :limit-father="limit"
        @addSucess="
          (e) => {
            form.detailImage.push(e)
          }
        "
        @deleteSucess="
          (e) => {
            form.detailImage = e
          }
        "
        @deleteImgaes="
          (e) => {
            deleteImages.push(e)
          }
        "
      />
    </el-form-item>

    <el-button type="primary" @click="submitForm(ruleFormRef)">添加新树木</el-button>
  </el-form>
</template>

<style scoped></style>
