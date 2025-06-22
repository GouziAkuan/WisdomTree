<template>
  <view class="tab-bar-container">
    <!-- 用户端导航 -->
    <view v-if="role === 'user'" class="tab-bar user-tab-bar">
      <view
        v-for="(item, index) in userTab"
        :key="index"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="switchTab(item, index)"
      >
        <image
          :src="activeIndex === index ? item.selectedIconPath : item.iconPath"
          class="tab-icon"
        />
        <text class="tab-text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 管理员导航 -->
    <view v-if="role === 'teacher'" class="tab-bar admin-tab-bar">
      <view
        v-for="(item, index) in teacherTabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="switchTab(item, index)"
      >
        <image
          :src="activeIndex === index ? item.selectedIconPath : item.iconPath"
          class="tab-icon"
        />
        <text class="tab-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";

// 定义组件属性
const props = defineProps({
  role: {
    type: String,
    default: "user",
  },
});

// 当前激活的标签索引
const activeIndex = ref(0);
// 当前路由
const currentRoute = ref("");

// 用户导航配置
const userTab = [
  {
    pagePath: "pages/index/index",
    iconPath: "/static/images/index.png",
    selectedIconPath: "/static/images/index.png",
    text: "首页",
  },
  {
    pagePath: "pages/ai/index",
    iconPath: "/static/images/notice.png",
    selectedIconPath: "/static/images/notice.png",
    text: "AI助理",
  },
  {
    pagePath: "pages/forum/index",
    iconPath: "/static/images/service.png",
    selectedIconPath: "/static/images/service.png",
    text: "环保论坛",
  },
  {
    pagePath: "pages/synergism/index",
    iconPath: "/static/images/forum.png",
    selectedIconPath: "/static/images/forum.png",
    text: "环保活动",
  },
  {
    pagePath: "pages/user/center/center",
    iconPath: "/static/images/user.png",
    selectedIconPath: "/static/images/user.png",
    text: "个人中心",
  },
];

// 管理员导航配置
const teacherTabs = [
  {
    pagePath: "pages/teacher/student/index",
    iconPath: "/static/images/service.png",
    selectedIconPath: "/static/images/service.png",
    text: "学生行为",
  },
  {
    pagePath: "pages/teacher/activity/index",
    iconPath: "/static/images/index.png",
    selectedIconPath: "/static/images/index.png",
    text: "家校活动",
  },
  {
    pagePath: "pages/teacher/feedback/index",
    iconPath: "/static/images/notice.png",
    selectedIconPath: "/static/images/notice.png",
    text: "家校反馈",
  },

  {
    pagePath: "pages/teacher/chat/index",
    iconPath: "/static/images/forum.png",
    selectedIconPath: "/static/images/forum.png",
    text: "家长私信",
  },
];

// 监听页面显示更新激活状态
onShow(() => {
  const pages = getCurrentPages();
  if (pages.length === 0) return;
  currentRoute.value = pages[pages.length - 1].route;
  updateActiveIndex();
});
// 更新激活状态
const updateActiveIndex = () => {
  // 根据角色选择对应的标签配置
  const tabs = props.role === "user" ? userTab : teacherTabs;
  const currentPath = currentRoute.value;
  // 查找当前路由对应的标签索引
  const index = tabs.findIndex((tab) => {
    const tabPath = tab.pagePath.replace(/^\//, ""); // 移除路径前的斜杠
    return currentPath === tabPath;
  });

  // 更新激活的标签索引
  activeIndex.value = index >= 0 ? index : 0;
};
// 切换标签
const switchTab = (item, index) => {
  if (activeIndex.value === index) return;
  if (props.role === "user") {
    // 如果是用户
    uni.redirectTo({
      url: `/${item.pagePath}`,
      success: () => {
        activeIndex.value = index; // 保持即时更新
      },
    });
  } else if (props.role === "teacher") {
    // 如果是管理员
    uni.redirectTo({
      url: `/${item.pagePath}`,
      success: () => {
        activeIndex.value = index; // 保持即时更新
      },
    });
  }
};
</script>

<style lang="scss" scoped>
.tab-bar-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  background: #fff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 999;
  padding-bottom: 55rpx;
}

.tab-bar {
  display: flex;
  height: 100%;
  padding: 16rpx 0;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .tab-icon {
      width: 68rpx;
      height: 68rpx;
      margin-bottom: 8rpx;
    }

    .tab-text {
      font-size: 20rpx;
      line-height: 1;
    }

    &.active {
      .tab-text {
        color: #35af86;
        font-weight: 500;
      }
    }
  }
}

.admin-tab-bar {
  .tab-item.active .tab-text {
    color: #5222ff;
  }
}
</style>
