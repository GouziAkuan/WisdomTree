<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const back = () => {
	// 返回上一页
	uni.navigateBack();
};
</script>

<template>
	<uni-row>
		<uni-col>
			<!-- 占位模块 -->
			<view class="zw"></view>
			<view class="all">
				<view class="image-nav">
					<image src="https://s21.ax1x.com/2024/09/15/pAuDKBQ.png" @click="back"></image>
				</view>
				<view class="status_bar">
					<!-- 这里是状态栏 -->
					<slot></slot>
				</view>
			</view>
		</uni-col>
	</uni-row>
</template>

<style scoped>
.zw {
	width: 100%;
	display: flex;
	height: 84px;
	z-index: 999;
}

.all {
	width: 100%;
	display: flex;
	height: 84px;
	z-index: 999;
	position: fixed;
	top: 0;
	transition: background-color 0.3s;
}

.image-nav {
	width: 20%;
	height: 84px;
	display: flex;
	justify-content: center;
}

.image-nav image {
	width: 50rpx;
	height: 50rpx;
	align-self: flex-end;
}

.status_bar {
	height: 84px;
	width: 90%;
	/* background-color: red; */
}
</style>
