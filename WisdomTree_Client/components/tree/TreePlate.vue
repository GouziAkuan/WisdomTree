<script setup>
import { defineProps } from "vue";

defineProps({
  show: { type: Boolean, default: false },
  currentEnergy: { type: Number, default: 0 },
  totalEnergy: { type: Number, default: 1000 },
});
</script>

<template>
  <uni-row>
    <uni-col span="22" offset="1">
      <view class="tree-detail">
        <view class="title">
          <p class="title-text">树木铭牌</p>
          <p class="mp-p">
            树林名称
            <span class="mp-span">四川省成都市生态古树林</span>
          </p>
          <p class="mp-p">
            地址
            <span class="mp-span activeone">成都市东部新区石盘镇</span>
          </p>
          <slot>
            <p class="mp-p">
              树种
              <span class="mp-span">树木名字</span>
            </p>
            <p class="mp-p">
              总数
              <span class="mp-span num">10 颗</span>
            </p>
            <p class="mp-p">
              剩余数量
              <span class="mp-span sy">9 颗</span>
            </p>
          </slot>
          <!-- 进度条 -->
          <view class="progress" v-if="show">
            <view class="energy-progress">
              <text>{{
                (currentEnergy / totalEnergy) * 100 >= 100
                  ? "能量已够！快去领养吧😎"
                  : "能量不足😢 继续加油！"
              }}</text>
            </view>
            <view class="progress-container">
              <view
                class="progress-bar"
                :style="{ width: (currentEnergy / totalEnergy) * 100 + '%' }"
              >
                <view class="progress-stripes"></view>
              </view>
            </view>
            <view class="progress-text">
              {{ currentEnergy }} / {{ totalEnergy }} 能量值
            </view>
          </view>
        </view>
      </view>
    </uni-col>
  </uni-row>
</template>

<style>
/* 树木铭牌 */
.mp-p {
  margin: 25rpx 0;
  font-size: 14px;
  color: #85898b;
}

.mp-span {
  color: black;
  font-weight: 700;
  margin-left: 15rpx;
}

.activeone {
  color: #4ab185;
}

.num {
  font-size: 13px;
  padding: 5rpx 10rpx;
  background-color: #e7f5fe;
  color: #458dda;
  border: 1px solid #458dda;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 25rpx;
}

.sy {
  font-size: 13px;
  padding: 5rpx 10rpx;
  background-color: #ffe5e4;
  color: #cf6c69;
  border: 1px solid #cf7269;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 20rpx;
}

.tree-detail {
  margin-top: 25rpx;
  padding: 35rpx;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 15rpx;
  height: fit-content;
}

.title-text {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20rpx;
}

/* 新增进度条样式 */
.progress-container {
  height: 24rpx;
  background: #f0f3f6;
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  margin: 20rpx 0 15rpx;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #4ab185 0%, #6ac7d6 100%);
  border-radius: 12px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-stripes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 24px 24px;
  animation: progress-stripes 1s linear infinite;
}

.progress-text {
  text-align: right;
  font-size: 12px;
  color: #6b7c87;
  margin-bottom: 10rpx;
  font-weight: 500;
}

@keyframes progress-stripes {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 24px 0;
  }
}

.energy-progress {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #4ab185;
  width: 100%;
  text-align: right;
}
</style>
