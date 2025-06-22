<script setup>
import { ref } from "vue";
import { useTokenStore } from "../../../stores/token";
import { BaseUrl } from "../../../common/request";
import { NewAccesstoken } from "../../../common/request";
import AutoBack from "../../../components/AutoBack.vue";

const tokenStore = useTokenStore();

// 模拟收藏数据
const posts = ref([
  {
    id: 1,
    title: "家校共育经验分享：如何培养孩子自主学习能力",
    cover: "https://picsum.photos/600/400?1",
    user: {
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      username: "李老师",
    },
    type: "日常",
    likeCount: 245,
    commentCount: 89,
    liked: true,
  },
]);

// 跳转到帖子详情
const goToDetail = (postId) => {
  uni.navigateTo({
    url: `/pages/forum/forumDetail/index?postId=${postId}`,
  });
};

const getCollectInfo = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken();
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/posts/myCollect`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error(res.data.message);
      }
      posts.value = res.data.data;
      posts.value.forEach((post) => {
        post.liked = true;
      });
    } catch (error) {
      console.log(error);
      uni.showToast({
        title: "请求错误",
        icon: "error",
      });
    } finally {
      uni.hideLoading();
    }
  } else {
    uni.hideLoading();
  }
};

getCollectInfo();
</script>

<template>
  <view class="favorites-container">
    <AutoBack />
    <!-- 收藏列表 -->
    <scroll-view scroll-y class="post-list">
      <view
        v-for="(post, index) in posts"
        :key="index"
        class="post-card"
        @click="goToDetail(post.id)"
      >
        <!-- 作者信息 -->
        <view class="user-info">
          <image
            class="user-avatar"
            :src="post.user.avatar"
            mode="aspectFill"
          />
          <text class="user-name">{{ post.user.username }}</text>
          <view class="time-tag">
            {{ post.type }}
          </view>
        </view>

        <!-- 帖子内容 -->
        <text class="post-title">{{ post.title }}</text>
        <image
          v-if="post.cover"
          class="post-cover"
          :src="post.cover"
          mode="aspectFill"
        />

        <!-- 互动数据 -->
        <view class="interaction-bar">
          <view class="interaction-item">
            <uni-icons
              :type="post.liked ? 'heart-filled' : 'heart'"
              size="20"
              :color="post.liked ? '#ff6b6b' : '#666'"
            />
            <text>{{ post.likeCount }}</text>
          </view>
          <view class="interaction-item">
            <uni-icons type="chat" size="20" color="#666" />
            <text>{{ post.commentCount }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <TabBar role="parents" />
  </view>
</template>

<style lang="scss" scoped>
.favorites-container {
  background: #f8fafc;
  min-height: 100vh; // 改用最小高度
  padding: 32rpx;
  padding-bottom: 120rpx; // 增加底部内边距（根据TabBar实际高度调整）
  box-sizing: border-box;

  .post-list {
    .post-card {
      background: #fff;
      border-radius: 24rpx;
      padding: 32rpx;
      margin-bottom: 32rpx;
      box-shadow: 0 8rpx 24rpx rgba(107, 158, 255, 0.08);

      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;
        position: relative;

        .user-avatar {
          width: 72rpx;
          height: 72rpx;
          border-radius: 50%;
          margin-right: 16rpx;
        }

        .user-name {
          font-size: 30rpx;
          color: #2d3436;
          font-weight: 500;
        }

        .time-tag {
          position: absolute;
          right: 0;
          background: #f5f8ff;
          padding: 8rpx 16rpx;
          border-radius: 24rpx;
          font-size: 24rpx;
          color: #6b9eff;
        }
      }

      .post-title {
        display: block;
        font-size: 34rpx;
        color: #2d3436;
        line-height: 1.4;
        margin-bottom: 24rpx;
        font-weight: 500;
      }

      .post-cover {
        width: 100%;
        height: 400rpx;
        border-radius: 16rpx;
        margin-bottom: 24rpx;
      }

      .interaction-bar {
        display: flex;
        gap: 48rpx;
        padding-top: 24rpx;
        border-top: 1rpx solid #eee;

        .interaction-item {
          display: flex;
          align-items: center;
          color: #666;

          uni-icons {
            margin-right: 12rpx;
          }

          text {
            font-size: 26rpx;
          }
        }
      }
    }
  }
}
</style>
