<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { BaseUrl } from "../../../common/request";
import { useTokenStore } from "@/stores/token";
import { NewAccesstoken } from "../../../common/request";
import { dayjs } from "@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js";
import AutoBackVue from "../../../components/AutoBack.vue";

const tokenStore = useTokenStore();

// 初始化帖子数据
const post = ref({
  user: {
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    username: "家长王女士",
  },
  images: [
    "https://tse4-mm.cn.bing.net/th/id/OIP-C.H-tStjhJTpJ4Vr9YlvvlAwHaEz?rs=1&pid=ImgDetMain",
    "https://tse4-mm.cn.bing.net/th/id/OIP-C.BMP241_mZWQv4l0ev1URRQHaFj?rs=1&pid=ImgDetMain",
  ],
  title: "三年级数学作业互助讨论",
  content: `各位家长好！今天孩子带回来的数学作业第5题有些难度，题目是：小明有12个苹果，每天吃2个，同时每天妈妈会再给他3个，问几天后苹果吃完？我们家孩子算出来是4天，但参考答案是6天。有没有家长能帮忙分析下解题思路？感谢！附上作业题目照片供参考。`,
  createdAt: "2024-3-25 15:30",
  likeCount: 18,
  comments: [
    {
      user: { username: "班主任李老师" },
      content:
        "这是典型的动态消耗问题，建议用表格法列出每天的变化量。参考答案计算的是包括补充苹果后的净消耗量。",
      createdAt: "2024-3-25 16:05",
      isAdmin: true,
    },
    {
      user: { username: "张爸爸" },
      content:
        "我们孩子算的是：(12 - 2x) + 3x = 0 → x=12？好像也不太对，求指教",
      createdAt: "2024-3-25 16:20",
    },
    {
      user: { username: "陈妈妈" },
      content: "同问！第7题的应用题也有点难理解，题目说...",
      createdAt: "2024-3-25 17:45",
    },
  ],
});
const postId = ref(null);
const newComment = ref("");
// 收藏状态
const isCollected = ref(false);
// 点赞状态
const isLiked = ref(false);

// 计算属性：排序评论
const sortedComments = computed(() =>
  post.value.comments?.sort((a, b) => (a.isAdmin ? -1 : 0))
);

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    const verify = await NewAccesstoken();
    if (verify) {
      const res = await uni.request({
        url: `${BaseUrl}/posts/detail`,
        method: "GET",
        data: { id: postId.value },
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });

      if (res.data.status !== 200) {
        throw new Error(res.data.message || "获取帖子详情失败");
      }

      post.value = {
        ...res.data.data,
        createdAt: dayjs(res.data.data.createdAt).format("YYYY-M-D HH:mm"),
      };

      // 评论区时间处理
      post.value.comments = post.value.comments.map((comment) => ({
        ...comment,
        createdAt: dayjs(comment.createdAt).format("YYYY-M-D HH:mm"),
      }));

      isLiked.value = post.value.isLike;
      isCollected.value = post.value.isCollect;
    }
  } catch (error) {
    console.error(error);
    uni.showToast({
      title: "加载失败，请重试",
      icon: "none",
    });
  }
};

// 点赞/取消点赞
const toggleLike = async () => {
  try {
    const verify = await NewAccesstoken();
    if (verify) {
      const res = await uni.request({
        url: `${BaseUrl}/posts/like`,
        method: "POST",
        data: { id: postId.value },
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });

      if (res.data.status !== 200) {
        throw new Error(res.data.message || "操作失败");
      }

      // 更新点赞数
      post.value.likeCount += res.data.message === "点赞成功" ? 1 : -1;
      isLiked.value = !isLiked.value;
      if (res.data.message === "点赞成功") {
        uni.showToast({
          title: "点赞成功，环保能量增加了5g哟🤩",
          icon: "none",
        });
      } else {
        uni.showToast({
          title: res.data.message,
          icon: "none",
        });
      }
    }
  } catch (error) {
    console.error(error);
    uni.showToast({
      title: "操作失败，请重试",
      icon: "none",
    });
  }
};

// 收藏/取消收藏
const toggleCollect = async () => {
  try {
    const verify = await NewAccesstoken();
    if (verify) {
      const res = await uni.request({
        url: `${BaseUrl}/posts/collect`,
        method: "POST",
        data: { id: postId.value },
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });

      if (res.data.status !== 200) {
        throw new Error(res.data.message || "操作失败");
      }

      isCollected.value = !isCollected.value;
      if (res.data.message === "收藏成功") {
        uni.showToast({
          title: "收藏成功，环保能量增加了5g哟🤩",
          icon: "none",
        });
      } else {
        uni.showToast({
          title: "取消收藏成功",
          icon: "none",
        });
      }
    }
  } catch (error) {
    console.error(error);
    uni.showToast({
      title: "操作失败，请重试",
      icon: "none",
    });
  }
};

// 发表评论
const addComment = async () => {
  if (!newComment.value.trim()) {
    uni.showToast({ title: "评论不能为空", icon: "none" });
    return;
  }
  try {
    const verify = await NewAccesstoken();
    if (verify) {
      const res = await uni.request({
        url: `${BaseUrl}/comments/send`,
        method: "POST",
        data: { postId: postId.value, content: newComment.value },
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });

      if (res.data.status !== 200) {
        throw new Error(res.data.message || "评论失败");
      }

      // 更新评论列表
      post.value.comments = res.data.data;
      // 时间处理
      post.value.comments = post.value.comments.map((comment) => ({
        ...comment,
        createdAt: dayjs(comment.createdAt).format("YYYY-M-D HH:mm"),
      }));
      newComment.value = "";
      uni.showToast({ title: "评论成功", icon: "success" });
    }
  } catch (error) {
    console.error(error);
    uni.showToast({
      title: "评论失败，请重试",
      icon: "none",
    });
  }
};

// 页面加载时获取 postId 并加载帖子详情
onLoad((options) => {
  postId.value = options.postId;
  fetchPostDetail();
});
</script>

<template>
  <AutoBackVue />
  <view class="post-detail">
    <!-- 头像和用户名 -->
    <view class="user-info">
      <image class="user-avatar" :src="post.user?.avatar" mode="aspectFill" />
      <text class="user-name">{{ post.user?.username }}</text>
    </view>

    <!-- 轮播图展示帖子图片 -->
    <swiper
      class="post-carousel"
      autoplay
      indicator-dots
      indicator-color="rgba(255,255,255,0.5)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(image, index) in post.images" :key="index">
        <image class="post-image" :src="image" mode="aspectFill"></image>
      </swiper-item>
    </swiper>

    <!-- 帖子内容 -->
    <view class="tz-nz">
      <view class="post-header">
        <text class="post-title">{{ post.title }}</text>
      </view>
      <view class="post-content">{{ post.content }}</view>
      <view class="post-content">📅 {{ post.createdAt }}</view>
    </view>

    <!-- 评论区 -->
    <view class="comments-section">
      <text class="comments-title">评论区</text>
      <scroll-view scroll-y class="comments-list">
        <view
          v-for="(comment, index) in sortedComments"
          :key="index"
          class="comment"
          :class="{ 'admin-highlight': comment.isAdmin }"
        >
          <view class="comment-header">
            <text class="comment-user">{{ comment.user.username }}</text>
            <text class="comment-time">{{ comment.createdAt }}</text>
          </view>
          <text class="comment-content">{{ comment.content }}</text>
        </view>
      </scroll-view>
      <!-- 发表评论 -->
      <view class="comment-input">
        <input v-model="newComment" placeholder="写下你的评论..." />
        <button type="primary" size="defaul" @click="addComment">发送</button>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="collect-btn" @click="toggleCollect">
        <uni-icons
          :type="isCollected ? 'star-filled' : 'star'"
          size="36"
          :color="isCollected ? '#ffd700' : '#ffd700'"
        />
      </button>
      <button class="like-btn" @click="toggleLike">
        <uni-icons
          :type="isLiked ? 'heart-filled' : 'heart'"
          size="36"
          :color="isLiked ? '#ff4d4f' : '#ff4d4f'"
        />
        <text class="like-count">{{ post.likeCount }}</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss">
.post-detail {
  padding: 32rpx;
  background: #f8fafc;
  min-height: 100vh;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;

  .user-avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  }

  .user-name {
    margin-left: 24rpx;
    font-size: 32rpx;
    color: #2d3436;
    font-weight: 600;
  }
}

/* 轮播图 */
.post-carousel {
  height: 600rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.1);

  .post-image {
    width: 100%;
    height: 100%;
  }
}

/* 帖子内容 */
.tz-nz {
  padding: 40rpx;
  margin: 40rpx 0;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.03);

  .post-header {
    margin-bottom: 32rpx;
  }

  .post-title {
    font-size: 36rpx;
    color: #2d3436;
    font-weight: 600;
    line-height: 1.4;
  }

  .post-content {
    font-size: 30rpx;
    color: #555;
    line-height: 1.6;
    margin: 24rpx 0;

    &:last-child {
      color: #999;
      font-size: 26rpx;
    }
  }
}

/* 评论区 */
.comments-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.03);
  margin-bottom: 30rpx;

  .comments-title {
    display: block;
    font-size: 32rpx;
    color: #2d3436;
    font-weight: 600;
    margin-bottom: 32rpx;
    padding-left: 16rpx;
    border-left: 8rpx solid #4caf50;
  }
}

/* 评论列表 */
.comments-list {
  max-height: 600rpx;
  margin-bottom: 32rpx;

  .comment {
    padding: 24rpx;
    margin-bottom: 24rpx;
    background: #f8fafc;
    border-radius: 16rpx;
    position: relative;

    &.admin-highlight {
      background: #f0fff4;
      border-left: 8rpx solid #4caf50;
      padding-left: 32rpx;

      .comment-user {
        color: #388e3c;
      }
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16rpx;
    }

    .comment-user {
      font-size: 28rpx;
      color: #666;
      font-weight: 600;
    }

    .comment-time {
      font-size: 24rpx;
      color: #999;
    }

    .comment-content {
      font-size: 28rpx;
      color: #444;
      line-height: 1.5;
    }
  }
}

/* 评论输入 */
.comment-input {
  display: flex;
  gap: 20rpx;
  align-items: center;

  input {
    flex: 1;
    padding: 20rpx 32rpx;
    background: #f8f9fb;
    border-radius: 48rpx;
    font-size: 28rpx;
  }

  button {
    width: 160rpx;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 48rpx;
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    font-size: 28rpx;
  }
}

/* 全局微调 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comment {
  animation: fadeIn 0.4s ease-out;
}

/* 操作按钮新样式 */
.actions {
  display: flex;
  gap: 32rpx;
  padding: 32rpx;
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
  position: sticky;
  bottom: 0rpx;
  z-index: 10;

  button {
    flex: 1;
    height: 96rpx;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &::after {
      border: none;
    }
  }

  .collect-btn {
    width: 96rpx;
    background: #fff;
    border: 2rpx solid #eee;

    &:active {
      background: #f0fff4;
    }

    .uni-icons {
      transition: transform 0.2s;
    }
  }

  .like-btn {
    flex: 2;
    background: linear-gradient(135deg, #fff, #f8f8f8);
    border: 2rpx solid #eee;
    padding: 0 48rpx;

    .uni-icons {
      margin-right: 16rpx;
    }

    .like-count {
      font-size: 32rpx;
      color: #666;
      font-weight: 500;
    }

    &:active {
      background: linear-gradient(135deg, #f0fff4, #e8f5e9);
    }
  }
}
</style>
