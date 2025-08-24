<script setup>
import { ref } from "vue";
import TabBar from "../../components/TabBar.vue";
import StatusBar from "../../components/StatusBar.vue";
import { BaseUrl } from "../../common/request";
import { NewAccesstoken } from "../../common/request";
import { useTokenStore } from "@/stores/token";

const tokenStore = useTokenStore();
const currentStep = ref(0);
const steps = ref(["植物识别", "养护建议"]);
// 植物识别图片
const plantImage = ref("");
// 控制植物识别结果显示
const plantResult = ref(false);
const plantRes = ref("");
// 控制养护建议结果显示
const adviceResult = ref(false);

// 养护建议提交数据
const formData = ref({
  status: "",
  leafImage: "",
  treeImage: "",
});

// 植物状态选择
const statusOptions = ref([
  { value: "缺水", text: "缺水" },
  { value: "营养不足", text: "营养不足" },
  { value: "虫害", text: "虫害" },
  { value: "光照不足", text: "光照不足" },
  { value: "正常", text: "正常" },
]);

// 养护建议结果
const careAdvice = ref([
  {
    icon: "home",
    title: "树木状态",
    content: "树木健康",
  },
  { icon: "color", title: "浇水建议", content: "建议每日清晨6:00-7:00浇水" },
  { icon: "compose", title: "施肥周期", content: "每月1次有机肥，3月追加氮肥" },
  { icon: "eye", title: "光照需求", content: "每日需至少4小时直射阳光" },
  { icon: "flag", title: "注意事项", content: "注意定期检查叶片背面虫害情况" },
]);

// 植物识别
const handleAnalyzePlant = async () => {
  try {
    const verify = await NewAccesstoken();
    if (!plantImage.value) {
      uni.showToast({ title: "请先上传植物图片", icon: "none" });
      return;
    }

    if (verify) {
      uni.showLoading({ title: "AI分析中...", mask: true });
      const res = await uni.request({
        url: `${BaseUrl}/ai/uploadPlant`,
        method: "POST",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
        data: {
          imageUrl: plantImage.value,
        },
      });
      if (res.data.code === 0) {
        plantRes.value = res.data.data.result;
        plantResult.value = true;
        uni.hideLoading();
        uni.showToast({
          title: "分析成功，环保能量增加了5g哟🤩",
          icon: "none",
        });
      } else {
        uni.hideLoading();
        throw new Error(res.data.message || "识别失败");
      }
    }
  } catch (e) {
    uni.hideLoading();
    console.error(e);
    uni.showToast({
      title: e.message || "识别失败，请重试",
      icon: "none",
    });
  }
};

// 获取养护建议
const handleGetAdvice = async () => {
  try {
    if (!formData.value.leafImage || !formData.value.treeImage) {
      uni.showToast({ title: "请上传完整图片", icon: "none" });
      return;
    }

    const verify = await NewAccesstoken();
    if (verify) {
      uni.showLoading({ title: "AI分析中...", mask: true });
      const res = await uni.request({
        url: `${BaseUrl}/ai/uploadSuggestion`,
        method: "POST",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
        data: {
          foliageUrl: formData.value.leafImage,
          treeUrl: formData.value.treeImage,
          treeStatus: formData.value.status,
        },
      });
      console.log(res);
      if (res.data.code === 0) {
        careAdvice.value = [
          { icon: "home", title: "树木状态", content: res.data.data.status },
          { icon: "color", title: "浇水建议", content: res.data.data.watering },
          {
            icon: "compose",
            title: "施肥周期",
            content: res.data.data.fertilization,
          },
          { icon: "eye", title: "光照需求", content: res.data.data.lighting },
          { icon: "flag", title: "注意事项", content: res.data.data.notes },
        ];
        adviceResult.value = true;
        uni.hideLoading();
        uni.showToast({
          title: "分析成功，环保能量增加了5g哟🤩",
          icon: "none",
        });
      } else {
        throw new Error(res.data.message || "获取建议失败");
      }
    }
  } catch (e) {
    uni.hideLoading();
    console.log(e);
    uni.showToast({
      title: e.message || "获取建议失败",
      icon: "none",
    });
  }
};

// 上传图片
const upload = async (e) => {
  // 检验图片大小不超过5mb
  if (e.tempFiles[0].size > 3 * 1024 * 1024) {
    uni.showToast({
      title: "不能超过3MB",
      icon: "error",
    });
    return;
  }
  const tempFilePaths = e.tempFilePaths;
  const res = await uni.uploadFile({
    url: `${BaseUrl}/file/upload`,
    filePath: tempFilePaths[0],
    name: "file",
  });
  const resdata = JSON.parse(res.data);
  return resdata.path;
};

// 上传植物识别图片
const handlePlantUpload = async (e) => {
  const path = await upload(e);
  if (path) {
    plantImage.value = path;
  } else {
    uni.showToast({
      title: "上传植物失败",
      icon: "error",
    });
  }
};

// 上传树叶图片
const handleLeafUpload = async (e) => {
  const path = await upload(e);
  if (path) {
    formData.value.leafImage = path;
  } else {
    uni.showToast({
      title: "上传树叶失败",
      icon: "error",
    });
  }
};

// 上传树木图片
const handleTreeUpload = async (e) => {
  const path = await upload(e);
  if (path) {
    formData.value.treeImage = path;
  } else {
    uni.showToast({
      title: "上传树木失败",
      icon: "error",
    });
  }
};

// 样式配置
const imageStyles = {
  height: "500rpx",
  width: "100%",
  borderRadius: "20rpx",
};

const smallImageStyles = {
  height: "200rpx",
  width: "100%",
  borderRadius: "15rpx",
};
</script>

<template>
  <view class="container">
    <StatusBar />
    <!-- 新增专业介绍模块 -->
    <view class="expert-intro">
      <image
        src="https://ts1.tc.mm.bing.net/th/id/R-C.934a72e4af3786c94c447690559fa5ef?rik=YshGDRy9PZpKBw&riu=http%3a%2f%2fpic.j9p.com%2fup%2f2023-10%2f202310161517242127.png&ehk=%2fEfsr67rwiMsr1uzQLJbweQmNfeY1c5pOli6GOkJMm4%3d&risl=&pid=ImgRaw&r=0"
        class="ai-avatar"
      />
      <view class="intro-text">
        <view class="title">植物AI助理</view>
        <view class="desc"> 基于AI大模型提供精准识别与个性化养护方案 </view>
      </view>
    </view>

    <view class="content">
      <!-- 步骤条样式升级 -->
      <view class="steps">
        <view
          v-for="(step, index) in steps"
          :key="index"
          :class="['step-item', currentStep === index ? 'active' : '']"
          @click="currentStep = index"
        >
          <view class="step-progress">
            <view class="step-icon">
              <text v-if="currentStep === index" class="animated-icon">🌿</text>
              <text v-else>{{ index + 1 }}</text>
            </view>
            <view v-if="currentStep === index" class="progress-bar"></view>
          </view>
          <text class="step-text">{{ step }}</text>
        </view>
      </view>

      <!-- 第一步：植物识别 -->
      <view v-show="currentStep === 0" class="step-content">
        <view class="upload-card animate__animated animate__fadeIn">
          <view class="upload-header">
            <view class="decor-line"></view>
            <view class="section-title">植物图像采集</view>
            <view class="decor-line"></view>
          </view>

          <view class="upload-area">
            <uni-file-picker
              limit="1"
              fileMediatype="image"
              :image-styles="imageStyles"
              @select="handlePlantUpload"
            >
              <template v-if="!plantImage">
                <view class="upload-placeholder">
                  <uni-icons type="camera" size="40" color="#95a5a6" />
                  <text class="upload-text">点击上传照片</text>
                </view>
              </template>
            </uni-file-picker>
          </view>

          <view v-if="plantResult" class="result-box">
            <view class="result-title">识别结果</view>
            <view class="plant-info">
              <view class="plant-detail">
                <text class="plant-name">{{ plantRes }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 第二步：养护建议 -->
      <view v-show="currentStep === 1" class="step-content">
        <view class="upload-card animate__animated animate__fadeIn">
          <view class="form-section">
            <uni-forms :modelValue="formData">
              <!-- 状态选择 -->
              <uni-forms-item label="当前状态" name="status">
                <uni-data-select
                  v-model="formData.status"
                  :localdata="statusOptions"
                  placeholder="请选择植物状态"
                />
              </uni-forms-item>

              <!-- 图片上传部分 -->
              <view class="dual-upload">
                <view class="upload-item">
                  <view class="upload-label">树叶照片</view>
                  <view class="small-upload">
                    <uni-file-picker
                      limit="1"
                      fileMediatype="image"
                      :image-styles="smallImageStyles"
                      @select="handleLeafUpload"
                      :sizeType="['compressed']"
                    >
                      <uni-icons
                        v-if="!leafImage"
                        type="plus"
                        size="30"
                        color="#bdc3c7"
                      />
                    </uni-file-picker>
                    <image
                      v-if="leafImage"
                      :src="leafImage"
                      class="small-preview"
                    />
                  </view>
                </view>
                <view class="upload-item">
                  <view class="upload-label">树木照片</view>
                  <view class="small-upload">
                    <uni-file-picker
                      limit="1"
                      fileMediatype="image"
                      :image-styles="smallImageStyles"
                      @select="handleTreeUpload"
                    >
                      <uni-icons
                        v-if="!treeImage"
                        type="plus"
                        size="30"
                        color="#bdc3c7"
                      />
                    </uni-file-picker>
                    <image
                      v-if="treeImage"
                      :src="treeImage"
                      class="small-preview"
                    />
                  </view>
                </view>
              </view>
            </uni-forms>
          </view>

          <view v-if="adviceResult" class="advice-result">
            <view
              class="advice-item"
              v-for="(item, index) in careAdvice"
              :key="index"
            >
              <uni-icons :type="item.icon" size="20" color="#27ae60" />
              <view class="advice-content">
                <text class="advice-title">{{ item.title }}</text>
                <text class="advice-text">{{ item.content }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button
          v-if="currentStep === 0"
          class="primary-btn"
          @click="handleAnalyzePlant"
        >
          立即识别
        </button>

        <button
          v-if="currentStep === 1"
          class="primary-btn"
          @click="handleGetAdvice"
        >
          获取养护建议
        </button>
      </view>
    </view>
  </view>

  <TabBar role="user" />
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding-bottom: 180rpx;
}

.content {
  padding: 20rpx 30rpx;
}

.steps {
  display: flex;
  justify-content: center;
  margin: 40rpx 0;
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 50rpx;
    &.active {
      .step-icon {
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
      }
      .step-text {
        color: #2c3e50;
      }
    }
  }
  .step-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #bdc3c7;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28rpx;
    transition: all 0.3s;
  }
  .step-text {
    margin-top: 15rpx;
    color: #95a5a6;
    font-size: 28rpx;
  }
}

.upload-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 120rpx;
}

.upload-title {
  font-size: 36rpx;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
}

.upload-hint {
  color: #95a5a6;
  font-size: 24rpx;
  text-align: center;
  margin: 20rpx 0;
}

.upload-area {
  height: 500rpx;
  background: #f8f9fa;
  border-radius: 20rpx;
  margin: 30rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .preview-image {
    width: 100%;
    height: 100%;
  }
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.dual-upload {
  display: flex;
  justify-content: space-between;
  margin: 30rpx 0;
  .upload-item {
    width: 48%;
    .upload-label {
      color: #34495e;
      font-size: 28rpx;
      margin-bottom: 20rpx;
    }
    .small-upload {
      height: 200rpx;
      background: #f8f9fa;
      border-radius: 15rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .small-preview {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.primary-btn {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border-radius: 50rpx;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  box-shadow: 0 10rpx 20rpx rgba(39, 174, 96, 0.2);
  transition: transform 0.2s;
  &:active {
    transform: scale(0.98);
  }
}

.advice-result {
  margin-top: 40rpx;
  .advice-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    background: #f8f9fa;
    border-radius: 15rpx;
    margin-bottom: 20rpx;
    .advice-content {
      margin-left: 20rpx;
      flex: 1;
    }
    .advice-title {
      display: block;
      color: #2c3e50;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    .advice-text {
      color: #7f8c8d;
      font-size: 26rpx;
    }
  }
}

.result-box {
  margin-top: 40rpx;
  .plant-info {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-radius: 15rpx;
    .plant-icon {
      width: 120rpx;
      height: 120rpx;
      margin-right: 30rpx;
    }
    .plant-name {
      font-size: 30rpx;
      color: #2c3e50;
      display: block;
      margin-bottom: 10rpx;
    }
    .plant-scientific {
      color: #7f8c8d;
      font-size: 24rpx;
    }
  }
}

.animate__animated {
  animation-duration: 0.5s;
}

/* 更新颜色变量 */
$primary-color: #3ba272;
$secondary-color: #4cd964;
$accent-color: #ffd700;

.nav-bar {
  box-shadow: 0 4rpx 20rpx rgba(59, 162, 114, 0.2);

  ::v-deep .uni-nav-bar-text-title {
    font-weight: 600;
    letter-spacing: 2rpx;
  }
}

.nav-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-top: 10rpx;
}

.expert-intro {
  display: flex;
  align-items: center;
  padding: 30rpx;
  // background: url("/static/bg-leaf.png") no-repeat right center/contain;

  .ai-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 30rpx;
    border: 4rpx solid #fff;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  }

  .title {
    font-size: 36rpx;
    color: $primary-color;
    font-weight: 600;
    margin-bottom: 10rpx;
  }

  .desc {
    font-size: 24rpx;
    color: #7e8c8d;
    line-height: 1.6;
  }
}

/* 步骤条新样式 */
.steps {
  .step-item {
    position: relative;

    &.active {
      .step-icon {
        background: linear-gradient(135deg, $primary-color, $secondary-color);
        box-shadow: 0 10rpx 20rpx rgba(59, 162, 114, 0.3);
        transform: scale(1.1);
      }

      .progress-bar {
        width: 80%;
        background: $primary-color;
      }
    }
  }

  .step-progress {
    position: relative;
    height: 100rpx;
  }

  .progress-bar {
    position: absolute;
    bottom: 30rpx;
    left: 50%;
    transform: translateX(-50%);
    height: 6rpx;
    width: 0;
    background: #ddd;
    transition: all 0.5s ease;
  }

  .step-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: #e8f5e9;
    color: $primary-color;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    transition: all 0.3s;

    .animated-icon {
      animation: pulse 1.5s infinite;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.upload-card {
  border: 2rpx solid rgba(59, 162, 114, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);

  .upload-header {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .decor-line {
      flex: 1;
      height: 2rpx;
      background: linear-gradient(
        90deg,
        transparent,
        $primary-color,
        transparent
      );
    }

    .section-title {
      padding: 0 30rpx;
      color: $primary-color;
      font-weight: 600;
      font-size: 32rpx;
    }
  }
}

.data-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);

  .chart-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    text {
      color: $primary-color;
      font-weight: 500;
      margin-left: 10rpx;
    }
  }

  // .radar-chart {
  //   height: 400rpx;
  //   background: url("/static/chart-bg.png") no-repeat center/contain;
  // }
}

/* 按钮样式升级 */
.primary-btn {
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  border: none;
  font-weight: 600;
  letter-spacing: 2rpx;
  margin-top: 30rpx;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 25%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 75%
    );
    animation: shine 3s infinite;
  }
}

@keyframes shine {
  0% {
    transform: translateX(-50%) rotate(45deg);
  }
  100% {
    transform: translateX(50%) rotate(45deg);
  }
}

.container {
  background: linear-gradient(
      155deg,
      rgba(240, 255, 244, 0.8) 0%,
      rgba(230, 255, 230, 0.9) 100%
    ),
    linear-gradient(155deg, #f0fff4 0%, #e6ffe6 100%);
  background-blend-mode: soft-light, overlay;
  background-size: 120px 120px, cover;
  min-height: 100%;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 20px,
      rgba(230, 255, 230, 0.03) 20px,
      rgba(230, 255, 230, 0.03) 40px
    );
    pointer-events: none;
  }
}

.expert-intro {
  background: rgba(255, 255, 255, 0.9); /* 添加半透明白色背景 */
  border-radius: 20rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.data-card {
  background: #fff;
  /* 移除图表背景图片 */
  .radar-chart {
    background: none;
    border: 2rpx solid #e8f5e9;
    border-radius: 15rpx;
  }
}

/* 调整上传组件样式 */
:deep(.uni-file-picker__header) {
  display: none;
}

:deep(.uni-file-picker__container) {
  width: 100%;
  height: 100%;
}

:deep(.uni-file-picker__box) {
  border: none !important;
  background: transparent !important;
}

.small-preview {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

/* 修复下拉框被遮挡问题 */
:deep(.uni-select) {
  position: relative;
  z-index: 999;
}

:deep(.uni-popper__content) {
  z-index: 1000 !important;
  transform-origin: center top !important;
}

// .step-content {
//   // position: relative;
//   // min-height: 800rpx; /* 保证有足够空间展开下拉 */
// }

.action-buttons {
  position: relative;
  z-index: 1; /* 确保按钮在下拉下方 */
}

/* 去除uni-file-picker默认边框 */
:deep(.uni-file-picker__container) {
  border: none !important;
}

:deep(.file-picker__box) {
  border: none !important;
  border-radius: 0 !important;
}

:deep(.file-picker__box-content) {
  border: none !important;
  margin: 0 !important;
}

/* 修复激活状态边框 */
:deep(.uni-file-picker__box) {
  border: none !important;

  &.is-add {
    border: none !important;
  }
}

/* 调整上传区域原有边框样式 */
.upload-area {
  border: 2rpx dashed #e8f5e9 !important; /* 保留虚线边框 */

  &:active {
    border-color: $primary-color !important;
  }
}

.small-upload {
  border: 2rpx dashed #e8f5e9 !important;
}

.result-title {
  margin-bottom: 20rpx;
}

.result-box {
  background: #f8fff9;
  border: 1rpx solid #e1f5e3;
  padding: 30rpx;
  margin-top: 30rpx;

  .result-title {
    color: #3ba272;
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 20rpx;
  }
}

.advice-result {
  .advice-item {
    background: linear-gradient(135deg, rgba(235, 255, 240, 0.5), #f8fff9);
    border: 1rpx solid #d1f0d5;
  }
}
</style>
