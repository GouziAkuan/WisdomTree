<script setup>
import StatusBar from "../../components/StatusBar.vue";
import { useTokenStore } from "@/stores/token";
import { ref } from "vue";
import { NewAccesstoken } from "../../common/request";
import { onLoad } from "@dcloudio/uni-app";
import { medalStore } from "../../stores/medal";
import TabBar from "../../components/TabBar.vue";
import { TreeModelUrl } from "../../common/request";
import { BaseUrl } from "../../common/request";

const tokenStore = useTokenStore();
const medal = medalStore();

//今日步数
const step = ref(0);

// 树信息
const treeInfo = ref({
  totalTrees: 10,
  totalTypes: 18,
});

// 控制组件显示和样式
const showxz = ref(false);

const know = () => {
  showxz.value = false;
  medal.clearMedalInfo();
};

const toTree = () => {
  uni.navigateTo({
    url: "/pages/tree/TreeList/TreeList",
  });
};

// 资源点击事件
const handleResourceClick = () => {
  uni.showModal({
    title: "即将打开3D树木养护模型",
    content: "确定要打开吗？",
    success(res) {
      if (res.confirm) {
        uni.navigateTo({
          url: `/pages/webview/index?url=${TreeModelUrl}`,
        });
      }
    },
  });
};

onLoad(() => {
  // 控制勋章显示
  if (medal.medalInfo.adoptionID !== "") {
    showxz.value = true;
  }
});

// 能量气泡数据
// const bubbles = ref([
//   {
//     id: 1,
//     value: 0,
//     collecting: false,
//     energyid: 1,
//   },
//   {
//     id: 2,
//     value: 0,
//     collecting: false,
//     energyid: 1,
//   },
//   {
//     id: 3,
//     value: 0,
//     collecting: false,
//     energyid: 1,
//   },
//   {
//     id: 4,
//     value: 0,
//     collecting: false,
//     energyid: 1,
//   },
//   {
//     id: 5,
//     value: 0,
//     collecting: false,
//     energyid: 1,
//   },
// ]);
const bubbles = ref([]);

// 点击气泡
const collectEnergy = async (bubble) => {
  // 标记收集状态
  bubble.collecting = true;

  try {
    // 调用领取接口
    await receiveEnergy(bubble.energyid, bubble.value);

    // 500ms后移除气泡
    setTimeout(() => {
      bubbles.value = bubbles.value.filter((b) => b.id !== bubble.id);
    }, 500);
  } catch (error) {
    // 失败时重置状态
    bubble.collecting = false;
  }
};

// 获取树木总量和种类总数
const getStatistics = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken();
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/datachart/user/statistics`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error(res.data.message || "请求失败");
      }
      treeInfo.value = res.data.data;
      uni.hideLoading();
    } catch (e) {
      console.log(e);
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

getStatistics();

// 随机分割能量函数（保持总数不变）
const splitEnergy = (total) => {
  // 当总量不足以分配时，直接返回单个气泡,最小能量为5
  if (total < 5) return [total];
  const points = [];
  // 生成4个分割点
  for (let i = 0; i < 4; i++) {
    points.push(Math.random());
  }
  points.sort((a, b) => a - b);

  const parts = [];
  let prev = 0;
  // 计算每个区间的值
  for (const point of points) {
    const val = Math.round((point - prev) * total);
    parts.push(val);
    prev = point;
  }
  // 最后一部分
  parts.push(total - parts.reduce((a, b) => a + b));

  // 过滤掉0值并保证至少5个气泡
  return parts
    .filter((n) => n > 0)
    .concat(Array(5).fill(1)) // 防止空值
    .slice(0, 5);
};

// 合并今日运动数据接口
const mergeTodayStep = async () => {
  try {
    uni.showLoading({
      title: "合并数据中",
    });
    const verify = await NewAccesstoken();
    if (!verify) return;

    // 微信登录获取 code
    const loginRes = await uni.login({
      provider: "weixin",
    });

    // 获取微信运动数据
    const runRes = await uni.getWeRunData();

    const res = await uni.request({
      url: `${BaseUrl}/wxRun/merge`,
      method: "POST",
      header: {
        authorization: `Bearer ${tokenStore.Accesstoken}`,
      },
      data: {
        code: loginRes.code,
        encryptedData: runRes.encryptedData,
        iv: runRes.iv,
      },
    });
    if (res.data.code === 0) {
      uni.hideLoading();
      uni.showToast({
        title: "合并成功",
        icon: "success",
      });
      setTimeout(() => {
        getStep();
      }, 800);
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: "合并失败",
      icon: "error",
    });
    console.log(error);
  }
};

// 获取今日可领的能量
const getStep = async () => {
  try {
    uni.showLoading({
      title: "获取能量中",
    });

    const verify = await NewAccesstoken();
    if (!verify) return;

    // 微信登录获取 code
    const loginRes = await uni.login({
      provider: "weixin",
    });

    // 获取微信运动数据
    const runRes = await uni.getWeRunData();

    // 将数据发送到后端解密
    const res = await uni.request({
      url: `${BaseUrl}/wxRun/decrypt`,
      method: "POST",
      header: {
        authorization: `Bearer ${tokenStore.Accesstoken}`,
      },
      data: {
        code: loginRes.code,
        encryptedData: runRes.encryptedData,
        iv: runRes.iv,
      },
    });
    if (res.data.code === 2) {
      uni.hideLoading();
      uni.showModal({
        title: "微信号发生变更",
        content: "确定要合并今日运动数据吗",
        success(res) {
          if (res.confirm) {
            mergeTodayStep();
          }
        },
      });
      return;
    }
    if (res.data.code === 1) {
      const parts = splitEnergy(res.data.data.energy);
      bubbles.value = parts.map((item, index) => ({
        id: new Date().getTime() + index,
        energyid: res.data.data.id,
        value: item,
        collecting: false,
      }));
      uni.hideLoading();
      uni.showToast({
        title: "能量小气泡来咯😍",
        icon: "none",
      });
    } else if (res.data.code === 0) {
      uni.hideLoading();
      uni.showToast({
        title: "步数不250，能量小气泡无法生产😢",
        icon: "none",
      });
    } else if (res.data.code === 3) {
      uni.hideLoading();
      uni.showToast({
        title: "暂时领取完啦，继续加油🤗",
        icon: "none",
      });
    }
    step.value = res.data.data.step;
  } catch (error) {
    console.log(error);
  }
};

getStep();

// 领养能量接口
const receiveEnergy = async (energyId, energyValue) => {
  try {
    const verify = await NewAccesstoken();
    if (!verify) return;

    const res = await uni.request({
      url: `${BaseUrl}/wxRun/receive`,
      method: "POST",
      header: {
        authorization: `Bearer ${tokenStore.Accesstoken}`,
      },
      data: {
        id: energyId,
        energy: energyValue,
      },
    });

    if (res.data.code !== 0) {
      throw new Error(res.data.message || "领取失败");
    }
    uni.showToast({
      title: `${res.data.message}`,
      icon: "success",
    });
  } catch (error) {
    uni.showToast({
      title: "领取失败",
      icon: "error",
    });
    throw error;
  }
};
</script>

<template>
  <view class="page">
    <StatusBar />
    <image
      class="bg-img"
      src="https://s21.ax1x.com/2024/09/15/pAuD3hq.jpg"
    ></image>
    <!-- 树林信息 -->
    <uni-row>
      <uni-col span="20" offset="2">
        <view class="tree">
          <view class="tree-top">
            <view class="main">
              <view class="sb">
                <image
                  src="https://s21.ax1x.com/2024/09/15/pAuyZ1x.png"
                ></image>
                <text>树木种类</text>
              </view>
              <text class="dada">{{ treeInfo.totalTypes }}种</text>
            </view>
            <view class="main">
              <view class="sb">
                <image
                  src="https://s21.ax1x.com/2024/09/15/pAuymjK.png"
                ></image>
                <text>树木数量</text>
              </view>
              <text class="dada">{{ treeInfo.totalTrees }}颗</text>
            </view>
          </view>
        </view>
        <view class="tree-btn">
          <text>今日步数：{{ step }}</text>
        </view>
      </uni-col>
    </uni-row>

    <!-- 种树按钮 -->
    <uni-row>
      <uni-col span="20" offset="2">
        <view class="btn">
          <view class="zs-btn" @click="toTree">
            <image src="https://s21.ax1x.com/2024/09/15/pAuyV91.png"></image>
            <p>我要领养</p>
          </view>

          <view class="zs-btn" @click="handleResourceClick">
            <image src="https://s21.ax1x.com/2024/09/15/pAuykN9.png"></image>
            <p>3D养护</p>
          </view>
        </view>
      </uni-col>
    </uni-row>

    <!-- 领取勋章 -->
    <view class="xunzang-box" v-if="showxz">
      <view class="xunzang">
        <view class="xunzhang-main">
          <p class="xz-title">环保勋章</p>
          <view class="xz-img">
            <image mode="aspectFill" :src="medal.medalInfo.avatar"></image>
          </view>
          <view class="xz-content">
            <p class="xz-p">感谢你和绿影慧领用户一起支持了对林场的保护!</p>
          </view>
          <view class="info">
            <view class="infoitem">
              <text>昵称：</text>
              <text class="tbg">{{ medal.medalInfo.nickName }}</text>
            </view>
            <view class="infoitem">
              <text>证书编号：</text>
              <text class="tbg">{{ medal.medalInfo.adoptionID }}</text>
            </view>
            <view class="infoitem">
              <text>树的类型：</text>
              <text class="tbg">{{ medal.medalInfo.treeType }}</text>
            </view>
          </view>
        </view>
        <p class="konw" @click="know">知道了</p>
      </view>
    </view>
  </view>

  <uni-row>
    <uni-col span="20" offset="2">
      <view class="energy-bubbles">
        <view class="bubble-wrapper">
          <view
            v-for="(bubble, index) in bubbles"
            :key="bubble.id"
            class="bubble"
            :class="{
              collecting: bubble.collecting,
              onefloat: index % 2 ? true : false,
              twofloat: index % 2 ? false : true,
            }"
            @click="collectEnergy(bubble)"
          >
            <text class="value">+{{ bubble.value }}g</text>
          </view>
        </view>
      </view>
    </uni-col>
  </uni-row>

  <TabBar role="user" />
</template>

<style scoped>
@import url("../../static/css/index.css");
</style>
