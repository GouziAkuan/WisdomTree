<script setup>
import { ref, watch, onUnmounted } from 'vue'
import UploadImage from '../UploadImage.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { requestWithRetry } from '@/common/interfaces/request'
import router from '@/router'
import deleteFileConfig from '@/common/interfaces/DeleteFile.interface'
import SearchInput from '../SearchInput.vue'
import { searchUserConfig } from '@/common/interfaces/User.interface'
import { searchTreeTypeConfig } from '@/common/interfaces/Tree.interface'
import { updateAdoptConfig } from '@/common/interfaces/Adopt.interface'

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
  AdoptID: 0,
  username: '',
  scientific_name: '',
  adoption_id: '',
  nickname: '',
  area: '',
  tree_type: '',
  wish: '',
  detailImage: []
})

// 父传子
const props = defineProps({
  adoptInfo: Object
})

// 监视父组件传来的树种信息
watch(
  () => props.adoptInfo,
  (newValue) => {
    form.value = newValue
  },
  { immediate: true }
)

// 领养类型选择
const options = [
  { value: '爱情纪念树', label: '爱情纪念树' },
  { value: '友情纪念树', label: '友情纪念树' },
  { value: '亲情纪念树', label: '亲情纪念树' },
  { value: '青春纪念树', label: '青春纪念树' },
  { value: '事业纪念树', label: '事业纪念树' },
  { value: '平安纪念树', label: '平安纪念树' }
]

// 区域选择
const optionsArea = [
  { value: '图书馆', label: '图书馆' },
  { value: '运动场', label: '运动场' },
  { value: '教学楼', label: '教学楼' },
  { value: '食堂', label: '食堂' },
  { value: '寝室', label: '寝室' }
]

// 表单规则
const rules = ref({
  username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
  scientific_name: [{ required: true, message: '请输入树木种类', trigger: 'blur' }],
  wish: [
    { required: true, message: '请输入领养愿望', trigger: 'blur' },
    { max: 30, message: '字数不超过30字', trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入领养昵称', trigger: 'blur' }],
  tree_type: [{ required: true, message: '请输领养类型', trigger: 'blur' }],
  detailImage: [{ required: true, message: '请上传领养图片', trigger: 'blur' }]
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
  ElMessageBox.confirm('确定要修改领养信息吗? 对应树木的详情图片可能会改变!', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      updateAdopt()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 提交后端
const updateAdopt = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const res = await requestWithRetry(updateAdoptConfig(form.value))
    // 重置表单
    ruleFormRef.value.resetFields()
    uploadEl.value.clearFiles()
    // 关闭加载
    loading.close()
    ElMessage.success(`${res.data.message}`)
    // 跳转
    router.push('/adminAdopt')
  } catch (error) {
    loading.close()
    console.log(error)
    ElMessage.error(`${error.response.data.message}`)
  }
}

// 取消挂载时 删除图片
onUnmounted(() => {
  deleteImages.value.forEach(async (item) => {
    // 后端删除图片
    await requestWithRetry(deleteFileConfig(item))
  })
})
</script>

<template>
  <el-tag size="large" style="margin: 2rem 0 0 0">领养编号：{{ form.adoption_id }}</el-tag>
  <el-form
    ref="ruleFormRef"
    :rules="rules"
    :model="form"
    label-width="auto"
    label-position="top"
    size="large"
    style="max-width: 60rem; margin-top: 2rem"
  >
    <el-form-item label="领养账号" prop="username">
      <SearchInput
        v-model="form.username"
        :placeholder="'请输入领养账号'"
        :search-method="searchUserConfig"
      />
    </el-form-item>
    <el-form-item label="领养树种" prop="scientific_name">
      <SearchInput
        v-model="form.scientific_name"
        :placeholder="'请输入领养树种'"
        :search-method="searchTreeTypeConfig"
      />
    </el-form-item>
    <el-alert
      title="请输入已有的树种和用户"
      :closable="false"
      style="margin: 2rem 0"
      type="warning"
      show-icon
    />
    <el-form-item label="领养昵称" prop="nickname">
      <el-input v-model="form.nickname" placeholder="输入领养昵称" />
    </el-form-item>
    <el-form-item label="领养类型" prop="tree_type">
      <el-select v-model="form.tree_type" placeholder="输入领养类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="领养区域" prop="area">
      <el-select v-model="form.area" placeholder="输入领养区域">
        <el-option
          v-for="item in optionsArea"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="领养愿望" prop="wish">
      <el-input v-model="form.wish" placeholder="输入领养愿望" />
    </el-form-item>
    <el-form-item label="详情图片" prop="detailImage">
      <UploadImage
        ref="uploadEl"
        :limit-father="limit"
        :more-image="form.detailImage"
        @addSucess="
          (e) => {
            form.detailImage.push(e)
          }
        "
        @deleteSucess="
          (e) => {
            console.log(e)
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

    <el-button type="primary" @click="submitForm(ruleFormRef)">修改领养信息</el-button>
  </el-form>
</template>

<style scoped></style>
