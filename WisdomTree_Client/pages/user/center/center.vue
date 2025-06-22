<script setup>
import StatusBar from "@/components/StatusBar.vue";
import { ref, computed } from "vue";
import TabBar from "@/components/TabBar.vue";
import { useTokenStore } from "../../../stores/token";
import { BaseUrl } from "../../../common/request";
import { NewAccesstoken } from "../../../common/request";

const tokenStore = useTokenStore();

const userInfo = ref({
  avatar: "",
  username: "",
  phone: "",
  activityCount: 0,
  adoptionsCount: 0,
  collectCount: 0,
});

const functions = computed(() => {
  return [
    {
      icon: "star",
      title: "参与活动",
      subtitle: `已参加${userInfo.value.activityCount}场`,
      gradient: "linear-gradient(135deg, #6b9eff, #8fd3f4)",
      path: "/pages/user/activity/index",
    },
    {
      icon: "info",
      title: "我的领养",
      subtitle: `已领养${userInfo.value.adoptionsCount}棵`,
      gradient: "linear-gradient(135deg, #32ccbc, #90f7ec)",
      path: "/pages/user/UserList/UserList",
    },
    {
      icon: "heart",
      title: "我的收藏",
      subtitle: `${userInfo.value.collectCount}篇优质内容`,
      gradient: "linear-gradient(135deg, #ffa726, #ffca28)",
      path: "/pages/user/collection/index",
    },
    {
      icon: "map",
      title: "数据可视化",
      subtitle: "呈现你的绿色数据",
      gradient: "linear-gradient(135deg, #ff6b6b, #ff8787)",
      path: "/pages/user/datachart/index",
    },
  ];
});

const navigateTo = (path) => {
  uni.navigateTo({
    url: path,
  });
};

// 退出登录处理
const handleLogout = () => {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        // 清除token
        tokenStore.clearToken();
        uni.reLaunch({
          url: "/pages/user/login/login",
        });
      }
    },
  });
};

// 获取个人信息
const getUserInfo = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken();
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/user/getUserInfo`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error(res.data.message);
      }
      userInfo.value = res.data.data;
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

const toEdit = () => {
  const userInfoStr = encodeURIComponent(JSON.stringify(userInfo.value));
  uni.navigateTo({
    url: `/pages/user/UpdateInfo/UpdateInfo?userInfoStr=${userInfoStr}`,
  });
};

getUserInfo();
</script>

<template>
  <view class="profile-container">
    <StatusBar />
    <!-- 头部信息 -->
    <view class="profile-header">
      <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
      <view class="info">
        <text class="name">{{ userInfo.username }}</text>
      </view>

      <!-- 编辑按钮 -->
      <button class="edit-btn" @click="toEdit">
        <uni-icons type="compose" size="25" color="#fff" />
      </button>

      <!-- 退出登录按钮 -->
      <button class="logout-btn" @click="handleLogout">
        <uni-icons type="arrow-right" size="25" color="#fff" />
      </button>
    </view>

    <view class="energy-card">
      <view class="energy-header">
        <uni-icons type="fire-filled" size="30" color="#fff" />
        <text class="energy-title">环保能量</text>
      </view>

      <view class="energy-value">
        <text class="current">{{ userInfo.energy }}</text>
        <text class="total">g 能量值</text>
      </view>

      <text class="energy-tip">收集气泡、发布帖子等皆可收获能量哟🥰</text>

      <!-- 添加右侧动画 -->
      <view class="energy-animation">
        <view
          v-for="i in 5"
          :key="i"
          class="bubble"
          :style="{
            left: `${15 + (i - 1) * 15}%`,
            animationDelay: `${i * 0.5}s`,
          }"
        >
          <uni-icons type="smallcircle-filled" size="24" color="#fff" />
        </view>
      </view>
    </view>

    <!-- 功能模块 -->
    <view class="function-grid">
      <view
        v-for="(item, index) in functions"
        :key="index"
        class="function-card"
        :style="{ background: item.gradient }"
        @click="navigateTo(item.path)"
      >
        <uni-icons :type="item.icon" size="48" color="#fff" />
        <text class="title">{{ item.title }}</text>
        <text class="subtitle">{{ item.subtitle }}</text>
      </view>
    </view>
  </view>

  <TabBar role="user" />
</template>

<style lang="scss">
.profile-container {
  background: #edf2ee;
  height: 100%;
  padding: 32rpx;

  /* 头部信息 */
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 48rpx;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      box-shadow: 0 8rpx 24rpx rgba(107, 158, 255, 0.2);
    }

    .info {
      margin-left: 32rpx;
      flex: 1;

      .name {
        font-size: 40rpx;
        font-weight: 600;
        color: #2d3436;
      }

      .phone {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-top: 12rpx;
      }
    }

    .edit-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80rpx;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #6b9eff, #4a90e2);
      box-shadow: 0 8rpx 24rpx rgba(107, 158, 255, 0.3);
      z-index: 999;
    }
  }

  /* 功能模块 */
  .function-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;

    .function-card {
      padding: 32rpx;
      border-radius: 24rpx;
      color: white;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.1) 100%
        );
        transform: rotate(-30deg);
      }

      .title {
        display: block;
        font-size: 36rpx;
        font-weight: 600;
        margin: 24rpx 0 12rpx;
      }

      .subtitle {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
  }

  // 学生标签
  .student-tag {
    display: flex;
    align-items: center;
    background: #f5f8ff;
    padding: 12rpx 0rpx;
    border-radius: 48rpx;
    margin-top: 16rpx;

    text {
      color: #6b9eff;
      font-size: 28rpx;
    }
  }

  /* 退出按钮样式 */
  .logout-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b6b, #ff8787);
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);
    margin-left: 20rpx;
    z-index: 999;
  }
}

// 能量卡片样式
.energy-card {
  background: linear-gradient(135deg, #4ab185, #6ac7d6);
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 48rpx;
  box-shadow: 0 16rpx 48rpx rgba(74, 177, 133, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    transform: rotate(-30deg);
    animation: energy-glow 3s linear infinite;
  }
}

.energy-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;

  .energy-title {
    color: #fff;
    font-size: 36rpx;
    font-weight: 600;
    margin-left: 20rpx;
  }
}

.energy-value {
  margin-bottom: 48rpx;

  .current {
    font-size: 72rpx;
    color: #fff;
    font-weight: 800;
    margin-right: 10rpx;
  }

  .total {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

.energy-progress {
  height: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
  margin-bottom: 32rpx;

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ffd700, #ffec8b);
    border-radius: 12rpx;
    position: relative;
    transition: width 0.6s ease;
  }

  .progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    animation: progress-glow 1.5s infinite;
  }
}

.energy-tip {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 30rpx;
}

@keyframes progress-glow {
  0% {
    left: -30%;
  }
  100% {
    left: 130%;
  }
}

@keyframes energy-glow {
  0% {
    transform: rotate(-30deg) translateX(-10%);
  }
  100% {
    transform: rotate(-30deg) translateX(10%);
  }
}

// 新增动画样式
.energy-card {
  position: relative;
  overflow: visible; // 修改为visible让气泡可以溢出
}

.energy-animation {
  position: absolute;
  right: -20rpx;
  bottom: -20rpx;
  width: 200rpx;
  height: 200rpx;
}

.bubble {
  position: absolute;
  animation: bubble-rise 2s infinite;
  opacity: 0;
  filter: drop-shadow(0 8rpx 16rpx rgba(255, 215, 0, 0.3));

  @keyframes bubble-rise {
    0% {
      transform: translateY(0) scale(0.8);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-100rpx) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translateY(-200rpx) scale(0.5);
      opacity: 0;
    }
  }

  // 为每个气泡设置不同路径
  &:nth-child(odd) {
    animation-name: bubble-rise-odd;
  }

  @keyframes bubble-rise-odd {
    0% {
      transform: translate(0, 0) scale(0.8);
    }
    50% {
      transform: translate(-20rpx, -100rpx) scale(1.1);
    }
    100% {
      transform: translate(-40rpx, -200rpx) scale(0.5);
    }
  }
}
</style>
