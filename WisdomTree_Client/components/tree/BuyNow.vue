<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['submit']);
const btnclick = () => {
	emit('submit');
};
</script>

<template>
	<view class="btn-box">
		<view class="xy">
			<slot name="xy"></slot>
		</view>
		<view class="btn" @click="btnclick">
			<slot name="text">
				<p>就领养它了!</p>
			</slot>
		</view>
	</view>
</template>

<style scoped>
.btn-box {
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: white;
	text-align: center;
	min-height: 100rpx;
	height: fit-content;
	padding-bottom: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.btn {
	width: 60%;
	text-align: center;
	padding: 25rpx;
	padding-top: 15rpx;
	padding-bottom: 15rpx;
	margin-top: 10rpx;
	margin-bottom: 10rpx;
	background-color: #48a77e;
	color: white;
	font-weight: 700;
	border-radius: 5px;
}
</style>
