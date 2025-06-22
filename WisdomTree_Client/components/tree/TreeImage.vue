<script setup></script>

<template>
  <uni-row>
    <uni-col span="22" offset="1">
      <view class="tree-detail">
        <view class="title">
          <p class="title-text">古树近照</p>
        </view>
        <view class="treeimage">
          <slot>
            <image
              src="https://s21.ax1x.com/2024/09/15/pAuDYcT.jpg"
              mode="aspectFill"
            ></image>
          </slot>
          <!-- 空div -->
          <view class="kong"></view>
        </view>
      </view>
    </uni-col>
  </uni-row>
</template>

<style>
/* 照片 */
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

.treeimage {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.treeimage image {
  width: 195rpx;
  height: 195rpx;
  margin-bottom: 20rpx;
  border-radius: 5px;
}

.kong {
  width: 195rpx;
  height: 0;
}
</style>
