<script setup></script>

<template>
  <view class="all-title">
    <!-- 右边 -->
    <view class="title-left">
      <slot>
        <text>第一步</text>
        <text>选一个自己喜欢的树种</text>
      </slot>
      <view class="bz">
        <view class="xian active"></view>
        <view class="xian"></view>
      </view>
    </view>
    <!-- 左边 -->
    <view class="title-right">
      <slot name="image">
        <image src="https://s21.ax1x.com/2024/09/15/pAuyV91.png"></image>
      </slot>
    </view>
  </view>
</template>

<style>
@import url("../../static/css/treetitle.css");
</style>
