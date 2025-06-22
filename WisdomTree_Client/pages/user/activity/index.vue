<script setup>
import { ref, computed } from "vue";
import { useTokenStore } from "../../../stores/token";
import { BaseUrl } from "../../../common/request";
import { NewAccesstoken } from "../../../common/request";
import { dayjs } from "@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js";
import AutoBack from "../../../components/AutoBack.vue";

const tokenStore = useTokenStore();

const activeTab = ref(0);
const tabs = ["全部", "未开始", "进行中", "已结束"];
const searchText = ref("");
const selectedActivity = ref(null);
const detailPopup = ref(null);

// 状态标签映射
const statusLabels = {
  upcoming: "未开始",
  ongoing: "进行中",
  ended: "已结束",
};

// 模拟活动数据
const activities = ref([
  {
    cover: "https://picsum.photos/300/200?1",
    title: "校园科技文化节",
    description:
      "年度科技创新成果展示与交流活动，包含机器人竞赛、科技作品展览等环节",
    startTime: "2025-03-01 09:00",
    endTime: "2025-03-05 17:00",
    location: "学校大礼堂",
    participated: 150,
    capacity: 200,
    status: "upcoming",
  },
  // 更多测试数据...
]);

const fetchActivityList = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken();
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/activity/signUpList`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error(res.data.message);
      }
      activities.value = res.data.data.map((item) => ({
        id: item.id, // 活动 ID
        cover: item.coverImageUrl, // 封面图片 URL
        title: item.title, // 活动标题
        description: item.content, // 活动详情
        startTime: item.startTime,
        endTime: item.endTime, // 格式化结束时间
        location: item.location, // 活动地点
        participated: item.currentCapacity, // 当前参与人数
        capacity: item.plannedCapacity, // 总容量
      }));
    } catch (error) {
      console.log(error);
      uni.showToast({
        title: "请求失败",
        icon: "error",
      });
    } finally {
      uni.hideLoading();
    }
  } else {
    uni.hideLoading();
  }
};

// 处理活动状态
const processedActivities = computed(() => {
  const now = dayjs();
  return activities.value.map((activity) => {
    const start = dayjs(activity.startTime);
    const end = dayjs(activity.endTime);

    let status = "ended";
    if (now.isBefore(start)) {
      status = "upcoming";
    } else if (now.isAfter(start) && now.isBefore(end)) {
      status = "ongoing";
    }

    return {
      ...activity,
      status,
    };
  });
});

// 筛选后的活动列表
const filteredActivities = computed(() => {
  return processedActivities.value.filter((activity) => {
    // 搜索条件
    const matchSearch =
      activity.title.includes(searchText.value) ||
      activity.description.includes(searchText.value);

    // 状态筛选
    const statusFilter =
      activeTab.value === 0
        ? true
        : activeTab.value === 1
        ? activity.status === "upcoming"
        : activeTab.value === 2
        ? activity.status === "ongoing"
        : activity.status === "ended";

    return matchSearch && statusFilter;
  });
});

// 时间格式化
const formatTime = (timeStr) => {
  return dayjs(timeStr).format("MM-DD HH:mm");
};

// 打开详情弹窗
const showDetail = (activity) => {
  selectedActivity.value = activity;
  detailPopup.value.open();
};

// 关闭详情弹窗
const closeDetail = () => {
  detailPopup.value.close();
  selectedActivity.value = null;
};

fetchActivityList();
</script>

<template>
  <view class="activity-container">
    <AutoBack />
    <!-- 搜索和筛选 -->
    <view class="activity-header">
      <view class="search-box">
        <uni-icons type="search" size="22" color="#999" />
        <input v-model="searchText" placeholder="搜索活动名称" />
        <button class="filter-btn">
          <uni-icons type="funnel" size="22" color="#66BB6A" />
        </button>
      </view>
      <view class="status-tabs">
        <text
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab', activeTab === index && 'active']"
          @click="activeTab = index"
        >
          {{ tab }}
        </text>
      </view>
    </view>

    <!-- 活动列表 -->
    <scroll-view scroll-y class="activity-list">
      <view
        v-for="(activity, index) in filteredActivities"
        :key="index"
        class="activity-card"
      >
        <image class="cover" :src="activity.cover" mode="aspectFill" />
        <view class="content">
          <view class="header">
            <text class="title">{{ activity.title }}</text>
            <view :class="['status', activity.status]">
              {{ statusLabels[activity.status] }}
            </view>
          </view>

          <view class="meta">
            <view class="meta-item">
              <uni-icons type="calendar" size="18" color="#66BB6A" />
              <text
                >{{ formatTime(activity.startTime) }} -
                {{ formatTime(activity.endTime) }}</text
              >
            </view>
            <view class="meta-item">
              <uni-icons type="location" size="18" color="#66BB6A" />
              <text>{{ activity.location }}</text>
            </view>
          </view>

          <view class="progress">
            <view class="progress-bar">
              <view
                class="progress-fill"
                :style="{
                  width:
                    (activity.participated / activity.capacity) * 100 + '%',
                }"
              />
            </view>
            <text class="progress-text">
              已参与 {{ activity.participated }}/{{ activity.capacity }} 人
            </text>
          </view>

          <view class="footer">
            <button class="action-btn" @click="showDetail(activity)">
              查看详情
            </button>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 活动详情弹窗 -->
    <uni-popup ref="detailPopup" type="center">
      <view class="detail-popup" v-if="selectedActivity">
        <image class="popup-cover" :src="selectedActivity.cover" />
        <view class="popup-content">
          <text class="popup-title">{{ selectedActivity.title }}</text>

          <view class="info-item">
            <uni-icons type="calendar" size="20" color="#66BB6A" />
            <text
              >{{ formatTime(selectedActivity.startTime) }} 至
              {{ formatTime(selectedActivity.endTime) }}</text
            >
          </view>

          <view class="info-item">
            <uni-icons type="location" size="20" color="#66BB6A" />
            <text>{{ selectedActivity.location }}</text>
          </view>

          <view class="info-item">
            <uni-icons type="person" size="20" color="#66BB6A" />
            <text
              >已参与 {{ selectedActivity.participated }}/{{
                selectedActivity.capacity
              }}
              人</text
            >
          </view>

          <view class="description">
            <text class="label">活动详情：</text>
            <text>{{ selectedActivity.description }}</text>
          </view>

          <button class="close-btn" @click="closeDetail">关闭</button>
        </view>
      </view>
    </uni-popup>

    <TabBar role="parents" />
  </view>
</template>

<style lang="scss" scoped>
.activity-container {
  background: #f8fafc;
  min-height: 100vh; // 改用最小高度
  padding: 24rpx;
  box-sizing: border-box;

  .activity-header {
    margin-bottom: 32rpx;

    .search-box {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 48rpx;
      padding: 24rpx 32rpx;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);

      input {
        flex: 1;
        margin: 0 24rpx;
        font-size: 28rpx;
      }

      .filter-btn {
        padding: 0;
        background: transparent;
        line-height: 1;
      }
    }

    .status-tabs {
      display: flex;
      margin-top: 32rpx;

      .tab {
        flex: 1;
        text-align: center;
        padding: 24rpx;
        font-size: 28rpx;
        color: #718096;
        position: relative;
        transition: all 0.3s;

        &.active {
          color: #6b9eff;
          font-weight: 500;

          &::after {
            content: "";
            position: absolute;
            bottom: 12rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 48rpx;
            height: 4rpx;
            background: #6b9eff;
            border-radius: 2rpx;
          }
        }
      }
    }
  }

  .activity-list {
    .activity-card {
      background: #fff;
      border-radius: 24rpx;
      margin-bottom: 32rpx;
      overflow: hidden;
      box-shadow: 0 8rpx 24rpx rgba(107, 158, 255, 0.08);

      .cover {
        width: 100%;
        height: 320rpx;
      }

      .content {
        padding: 32rpx;

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24rpx;

          .title {
            font-size: 34rpx;
            font-weight: 500;
            color: #2d3436;
            flex: 1;
          }

          .status {
            font-size: 24rpx;
            padding: 8rpx 16rpx;
            border-radius: 8rpx;
            margin-left: 24rpx;

            &.upcoming {
              background: rgba(255, 163, 38, 0.1);
              color: #ffa726;
            }

            &.ongoing {
              background: rgba(107, 158, 255, 0.1);
              color: #6b9eff;
            }

            &.ended {
              background: rgba(134, 142, 150, 0.1);
              color: #868e96;
            }
          }
        }

        .meta-item {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;
          color: #718096;
          font-size: 26rpx;

          uni-icons {
            margin-right: 12rpx;
          }
        }

        .progress {
          margin: 32rpx 0;

          &-bar {
            height: 12rpx;
            background: #e2e8f0;
            border-radius: 6rpx;
            overflow: hidden;
          }

          &-fill {
            height: 100%;
            background: linear-gradient(90deg, #6b9eff, #8fd3f4);
            border-radius: 6rpx;
            transition: width 0.5s ease;
          }

          &-text {
            display: block;
            margin-top: 12rpx;
            font-size: 24rpx;
            color: #718096;
          }
        }

        .footer {
          display: flex;
          justify-content: flex-end;

          .action-btn {
            width: 50%;
            background: linear-gradient(135deg, #6b9eff, #8fd3f4);
            color: #fff;
            border-radius: 18rpx;
            padding: 12rpx 32rpx;
            font-size: 30rpx;
            box-shadow: 0 4rpx 12rpx rgba(107, 158, 255, 0.3);
          }
        }
      }
    }
  }

  .detail-popup {
    width: 80vw;
    background: #fff;
    border-radius: 24rpx;
    overflow: hidden;

    .popup-cover {
      width: 100%;
      height: 300rpx;
    }

    .popup-content {
      padding: 32rpx;

      .popup-title {
        display: block;
        font-size: 36rpx;
        font-weight: 600;
        color: #2d3436;
        margin-bottom: 24rpx;
      }

      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;
        font-size: 28rpx;
        color: #4a5568;

        uni-icons {
          margin-right: 12rpx;
          flex-shrink: 0;
        }
      }

      .description {
        margin: 32rpx 0;
        font-size: 28rpx;
        line-height: 1.6;
        color: #4a5568;

        .label {
          color: #2d3436;
          font-weight: 500;
          margin-right: 12rpx;
        }
      }

      .close-btn {
        background: #f8fafc;
        color: #6b9eff;
        border-radius: 48rpx;
        padding: 16rpx 0;
        width: 100%;
        margin-top: 32rpx;
        font-weight: 500;
      }
    }
  }
}

/* 全局弹窗样式 */
::v-deep .uni-popup__wrapper-box {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10rpx);
}

.activity-container {
  // 修改所有蓝色主题色为绿色
  $primary-color: #4caf50; // 主绿色
  $secondary-color: #8bc34a; // 辅助绿色
  $gradient-green: linear-gradient(135deg, #66bb6a, #4caf50); // 渐变绿色

  .activity-header {
    .search-box {
      .filter-btn {
        color: $primary-color; // 筛选按钮颜色
      }
    }

    .status-tabs {
      .tab {
        &.active {
          color: $primary-color;
          &::after {
            background: $primary-color; // 激活状态指示条
          }
        }
      }
    }
  }

  .activity-list {
    .activity-card {
      box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.08); // 绿色阴影

      .content {
        .header {
          .status {
            &.upcoming {
              background: rgba(255, 193, 7, 0.1); // 保持黄色系未开始状态
              color: #ffa000;
            }
            &.ongoing {
              background: rgba(76, 175, 80, 0.1); // 绿色进行中
              color: $primary-color;
            }
            &.ended {
              background: rgba(158, 158, 158, 0.1); // 灰色已结束
              color: #9e9e9e;
            }
          }
        }

        .progress {
          &-fill {
            background: linear-gradient(90deg, #8bc34a, #4caf50); // 绿色进度条
          }
        }

        .footer {
          .action-btn {
            background: $gradient-green; // 按钮渐变
            box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3); // 绿色阴影
          }
        }
      }
    }
  }

  .detail-popup {
    .popup-content {
      .info-item {
        uni-icons {
          color: $primary-color !important; // 信息图标颜色
        }
      }

      .close-btn {
        color: $primary-color; // 关闭按钮文字颜色
        border: 2rpx solid $primary-color; // 添加绿色边框
      }
    }
  }

  // 修改进度条文字
  .progress-text {
    color: $primary-color;
  }
}
</style>
