<script setup>
import { ref, onMounted } from "vue";
import TabBar from "@/components/TabBar.vue";
import { useTokenStore } from "@/stores/token";
import { BaseUrl } from "../../common/request";
import { NewAccesstoken } from "../../common/request";
import { onPullDownRefresh } from "@dcloudio/uni-app";
import StatusBar from "../../components/StatusBar.vue";

const tokenStore = useTokenStore();

// 初始化 posts 数组，用于存储获取的帖子列表数据
const posts = ref([
  {
    id: 2,
    title: "图书馆使用反馈",
    cover:
      "https://ts1.tc.mm.bing.net/th/id/R-C.51136d1c637fda152da24b3516f793cc?rik=gh2493Twnk0sJA&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn20117%2f50%2fw1400h1050%2f20191101%2fc344-ihuuxut6898310.jpg&ehk=lh0E7yuVHF3x4Ysf3tU%2fbE7zRNL1PjJs6rYCGXdleRE%3d&risl=&pid=ImgRaw&r=0",
    likeCount: 89,
    commentCount: 15,
    user: {
      username: "学习委员",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    liked: false,
  },
]);

// 初始化 total 变量，用于记录总帖子数
const total = ref(0);

// 设置每页显示的帖子数量
const pageSize = ref(6);

// 初始化当前页码，从第1页开始
const currentPage = ref(1);

// 初始化选中的帖子类型，0表示默认类型或未选择
const selectedType = ref(0);

// 处理分页切换
const handlePageChange = (e) => {
  currentPage.value = e.current;
  getList();
};

// 处理帖子类型切换
const handleTypeChange = (e) => {
  selectedType.value = e.currentIndex;
  currentPage.value = 1;
  getList();
};

// 跳转到帖子详情
const goToDetail = (postId) => {
  uni.navigateTo({
    url: `/pages/forum/forumDetail/index?postId=${postId}`,
  });
};

// 发布帖子
const toadd = () => {
  uni.navigateTo({
    url: "/pages/forum/addForum/index",
  });
};

// 获取帖子列表
const getList = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken();

  if (verify) {
    try {
      const typeMap = ["all", "反馈", "日常"];
      const res = await uni.request({
        url: `${BaseUrl}/posts/get`,
        method: "GET",
        data: {
          page: currentPage.value,
          pageSize: pageSize.value,
          type: typeMap[selectedType.value],
        },
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });

      if (res.data.status !== 200) {
        throw new Error(res.data.message || "请求失败");
      }
      // 格式化数据
      posts.value = res.data.data.list.map((item) => ({
        ...item,
        cover: item.cover,
        user: {
          username: item.user?.username || "未知用户",
          avatar: item.user?.avatar || "/default-avatar.png",
        },
        liked: true,
      }));
      total.value = res.data.data.total;
      uni.hideLoading();
    } catch (e) {
      console.error(e);
      uni.hideLoading();
      uni.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
    }
  } else {
    uni.hideLoading();
  }
};

// 初始化加载
onMounted(() => {
  getList();
});

onPullDownRefresh(async () => {
  console.log("下拉刷新");
  currentPage.value = 1; // 重置当前页码为第一页
  // await getList(); // 重新获取数据
  uni.stopPullDownRefresh(); // 停止下拉刷新动画
});
</script>

<template>
  <view class="forum-container">
    <StatusBar />
    <!-- 头部区域 -->
    <view class="header">
      <view class="header-content">
        <text class="title">环保论坛</text>
        <text class="subtitle">共建绿色校园，分享环保心得</text>
      </view>
      <button class="add-btn" @click="toadd">+</button>
    </view>

    <!-- 分段器（帖子类型切换） -->
    <uni-segmented-control
      styleType="text"
      :current="selectedType"
      :values="['全部', '反馈', '日常']"
      @clickItem="handleTypeChange"
    />

    <!-- 帖子列表 -->
    <view class="post-list">
      <view
        v-for="(item, index) in posts"
        :key="index"
        class="post-card"
        @click="goToDetail(item.id)"
      >
        <!-- 帖子封面 -->
        <view class="image-wrapper">
          <image class="post-image" :src="item.cover" mode="aspectFill"></image>
          <view class="image-overlay">
            <text class="post-title">{{ item.title }}</text>
          </view>
        </view>

        <!-- 帖子信息 -->
        <view class="post-info">
          <view class="user-info">
            <image
              class="user-avatar"
              :src="item.user.avatar"
              mode="aspectFill"
            ></image>
            <text class="user-name">{{ item.user.username }}</text>
          </view>

          <view class="post-meta">
            <view class="meta-item">
              <uni-icons
                :type="item.liked ? 'heart-filled' : 'heart'"
                size="20"
                :color="item.liked ? '#ff6b6b' : '#666'"
              />
              <text>{{ item.likeCount }}</text>
            </view>
            <view class="meta-item">
              <uni-icons type="chat" size="20" color="#666" />
              <text>{{ item.commentCount }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分页 -->
    <uni-pagination
      class="pagination"
      :total="total"
      :pageSize="pageSize"
      :current="currentPage"
      show-icon="true"
      @change="handlePageChange"
    />
  </view>

  <TabBar role="user" />
</template>

<style lang="scss">
.forum-container {
  background: #f8fafc;
  min-height: 100vh; // 改用最小高度
  padding: 0 24rpx;
  padding-bottom: 220rpx; // 增加底部内边距（根据TabBar实际高度调整）
  box-sizing: border-box;
}

/* 头部区域 */
.header {
  display: flex;
  align-items: flex-start; // 修改对齐方式
  padding: 40rpx 0 20rpx; // 调整下边距

  .header-content {
    flex: 1;
    padding-right: 32rpx;
  }

  .title {
    font-size: 44rpx;
    font-weight: 700;
    color: #2d3436;
    position: relative;
    padding-left: 32rpx;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8rpx;
      height: 36rpx;
      background: linear-gradient(135deg, #4caf50, #8bc34a); // 绿色渐变
      border-radius: 4rpx;
    }
  }

  .subtitle {
    display: block;
    margin-top: 16rpx;
    font-size: 28rpx;
    color: #7c8dad;
    line-height: 1.6;
  }

  .add-btn {
    position: fixed;
    right: 24rpx;
    bottom: 230rpx;
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    color: white;
    font-size: 48rpx;
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.2); // 绿色阴影
    transition: transform 0.2s;
    z-index: 999;
    line-height: 96rpx;

    &::after {
      border: none;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

/* 分段器样式 */
.uni-segmented-control {
  margin: 24rpx 0;

  ::v-deep .segmented-control__item {
    font-size: 32rpx;
    color: #666;
    padding: 24rpx 48rpx;
    transition: all 0.3s;

    &.segmented-control__item--active {
      color: #2d3436;
      font-weight: 600;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 48rpx;
        height: 6rpx;
        background: #4caf50;
        border-radius: 3rpx;
      }
    }
  }
}

/* 帖子列表 */
.post-list {
  margin-top: 32rpx;
}

.post-card {
  background: #fff;
  border-radius: 32rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.03);
  transition: transform 0.3s, box-shadow 0.3s;

  &:active {
    transform: translateY(4rpx);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  }
}

/* 封面图片 */
.image-wrapper {
  height: 360rpx;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  z-index: 2;
}

.post-title {
  color: #fff;
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

/* 帖子信息 */
.post-info {
  padding: 32rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;

  .user-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }

  .user-name {
    font-size: 28rpx;
    color: #666;
    margin-left: 24rpx;
  }
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .meta-item {
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

/* 分页样式 */
.pagination {
  margin-top: 48rpx;

  ::v-deep .uni-pagination__num {
    border-radius: 16rpx;
    margin: 0 8rpx;
    transition: all 0.3s;

    &.current {
      background: linear-gradient(135deg, #4caf50, #8bc34a) !important;
      color: white !important;
    }
  }
}

/* 动画效果 */
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

.post-card {
  animation: fadeIn 0.6s ease-out;
}
</style>
