<script setup></script>

<template>
	<uni-row>
		<uni-col span="22" offset="1">
			<view class="tree-detail">
				<view class="title">
					<p class="title-text">树木详情</p>
				</view>
				<view class="content">
					<p class="content-text">
						<slot></slot>
					</p>
				</view>
			</view>
		</uni-col>
	</uni-row>
</template>

<style scoped>
/* 树木详情 */
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

.content-text {
	line-height: 50rpx;
	font-size: 14px;
	letter-spacing: 1px;
}
</style>
