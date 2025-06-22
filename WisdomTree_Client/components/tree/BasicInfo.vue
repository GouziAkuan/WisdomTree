<script setup></script>

<template>
  <uni-row>
    <uni-col>
      <image
        class="bg-img"
        src="https://s21.ax1x.com/2024/09/15/pAuDYcT.jpg"
      ></image>
    </uni-col>
    <uni-col span="20" offset="2">
      <view class="basic-info">
        <view class="left">
          <p class="tree-name"><slot name="info-name">树木名称</slot></p>
          <p class="tree-smallname"><slot name="info-smname">树木别名</slot></p>
          <p class="df">所属树林</p>
          <p class="treeling">四川省成都市生态科普基地</p>
        </view>

        <view class="right">
          <slot name="touxiang">
            <image src="https://s21.ax1x.com/2024/09/15/pAuDlAs.jpg"></image>
          </slot>
        </view>
      </view>
    </uni-col>
  </uni-row>
</template>

<style>
/* 基本信息 */
.bg-img {
  width: 100%;
  position: absolute;
  top: -85px;
}

.basic-info {
  position: relative;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 50rpx;
  z-index: 1;
}

.tree-name {
  font-size: 20px;
  font-weight: 700;
  margin: 20rpx 0;
}

.tree-smallname {
  font-size: 14px;
  margin: 20rpx 0;
  color: #85898b;
}

.right image {
  width: 200rpx;
  height: 210rpx;
  border-radius: 8px;
}

.df {
  font-size: 14px;
  margin: 20rpx 0;
  color: #85898b;
}

.treeling {
  color: #4ab185;
  font-weight: 700;
}
</style>
