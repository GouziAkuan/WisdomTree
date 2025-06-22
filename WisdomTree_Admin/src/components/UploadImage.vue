<script setup>
import { BaseUrl } from '@/common/BaseUrl'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const uploadRef = ref(null)

// 父传子
const props = defineProps({
  oneImage: String, //单张回显
  moreImage: Array, //多张回显
  limitFather: Number
})

// 子组件向父组件送数据
const emit = defineEmits(['addSucess'], ['deleteSucess'], ['deleteImgaes'])

// 已上传的图片列表 并且用到v-model是双向绑定
const fileList = ref([])
// 存储预览图片地址（真正的URL）
const dialogImageUrl = ref('')
// 图片预览对话框显示
const dialogVisible = ref(false)

// 监听父组件传递的图片地址（编辑的时候起到回显照片作用） 只用执行一次(异步才会数据没问题)
watch(
  () => props.oneImage,
  (newVal) => {
    if (newVal) {
      fileList.value = [{ url: newVal }]
    }
  },
  { once: true }
)

watch(
  () => props.moreImage,
  (newVal) => {
    // 回显图片
    fileList.value = newVal.map((item) => ({ url: item }))
  },
  { once: true }
)

/**
 *
 * @param uploadFile 删除的图片
 * @param uploadFiles 剩余的数组
 */
const handleRemove = (uploadFile, uploadFiles) => {
  // limit=1
  if (props.limitFather === 1) {
    emit('deleteSucess', '')
  }
  // limtit大于1
  else {
    const getDetailImage = () => {
      if (uploadFile.response) {
        return uploadFiles.map((item) => item.response.path)
      } else {
        return uploadFiles.map((item) => item.url)
      }
    }

    const detailImage = getDetailImage()
    emit('deleteSucess', detailImage)
  }
  // sb阿里 回显照片和选择照片 打印出来的数据不一样
  if (uploadFile.response) {
    emit('deleteImgaes', uploadFile.response.path)
  } else {
    emit('deleteImgaes', uploadFile.url)
  }
  ElMessage.success('删除成功')
}

// 点击图片
const handlePictureCardPreview = (uploadFile) => {
  // 赋值预览图片地址
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 上传成功 fileList会自己存不用手动
const successUpload = (file) => {
  emit('addSucess', file.path)
}

// 上传前验证
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 1

  if (!isJpgOrPng) {
    ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 1MB!')
  }
  return isJpgOrPng && isLt2M
}

// 清空上传列表（父组件提交成功后调用）
const clearFiles = () => {
  // elementui 上传组件的clearFiles方法
  uploadRef.value.clearFiles()
}

// 暴露子组件方法
defineExpose({ clearFiles })
</script>

<template>
  <div>
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :limit="props.limitFather"
      :action="BaseUrl + '/file/upload'"
      name="file"
      :show-file-list="true"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="successUpload"
      :before-upload="beforeUpload"
      :on-exceed="() => ElMessage.warning('最多只能上传一张图片')"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-alert
      title="图片格式只能是JPG或PNG，大小不能超过1MB"
      :closable="false"
      style="margin-top: 2rem"
      type="warning"
      show-icon
    />

    <!-- 图片预览 -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" class="image-preview" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style scoped>
/* 可以在这里添加样式 */
.image-preview {
  /* 图片预览样式 */
  width: 100%;
}
</style>
