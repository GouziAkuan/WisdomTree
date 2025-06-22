<template>
  <view class="container">
    <web-view :src="externalUrl"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      externalUrl: "",
    };
  },
  onLoad(option) {
    this.externalUrl = option.url;
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
</style>
