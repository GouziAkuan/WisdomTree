<template>
  <uni-row>
    <uni-col span="22" offset="1">
      <view class="xy">
        <view class="xy-image">
          <image src="https://s21.ax1x.com/2024/09/15/pAuDUuF.png"></image>
        </view>
        <view class="xy-text">
          <p>你的心愿：</p>
          <slot>
            <p>家人们，新年快乐！</p>
            <p>2024年8月17日</p>
          </slot>
        </view>
      </view>
    </uni-col>
  </uni-row>
</template>

<script setup></script>

<style>
.xy {
  position: relative;
  margin-top: 25rpx;
}

.xy-image {
  text-align: center;
}

.xy image {
  width: 90%;
  height: 400rpx;
}

.xy-text {
  position: absolute;
  top: 65rpx;
  left: 75rpx;
  width: 80%;
  color: #79bd9d;
  line-height: 55rpx;
  font-weight: 700;
  height: 220rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.xy-text :nth-child(3) {
  text-align: right;
}
</style>
