<script setup>
import { defineEmits } from "vue";

const emits = defineEmits(["cardclick"]);
const cardclick = () => {
  emits("cardclick");
};
</script>

<template>
  <view class="user-info__card" @click="cardclick">
    <view class="user-info__card__item">
      <view class="card-nr">
        <slot name="title"><p>更多功能</p></slot>
        <slot name="text"><p>敬请期待</p></slot>
      </view>
      <view class="card-img__box">
        <slot name="image">
          <image
            src="https://s21.ax1x.com/2024/09/15/pAuyFAJ.png"
            class="card-img"
          ></image>
        </slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
@import url("../../../static/css/centercard.css");
</style>
