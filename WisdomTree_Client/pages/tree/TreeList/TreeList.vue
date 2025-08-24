<script setup>
// ====================== 组件与工具导入 ======================
import AutoBackVue from "../../../components/AutoBack.vue";
import TreeCardVue from "../../../components/tree/TreeCard.vue";
import TreeTitleVue from "../../../components/tree/TreeTitle.vue";
import NoDataVue from "../../../components/NoData.vue";

import { useTokenStore } from "@/stores/token"; // Pinia 状态管理（保存 token）
import { ref, computed, onMounted } from "vue"; // Vue 组合式 API
import { NewAccesstoken, BaseUrl } from "../../../common/request"; // 请求工具

// ====================== 全局状态 ======================
const tokenStore = useTokenStore(); // 获取 token store（用于鉴权）

// ====================== 页面跳转 ======================
/**
 * 跳转到详情页
 * @param {number} id 树的 id
 */
const todeail = (id) => {
  uni.navigateTo({
    url: `/pages/tree/TreeDetail/TreeDetail?treeTypeID=${id}`,
  });
};

// ====================== 分页 & 加载状态 ======================
const page = ref(1); // 当前页码
const pageSize = ref(6); // 每页数据量
const status = ref("more"); // 加载状态：more(还有更多)/loading(加载中)/noMore(没有更多)
const contentText = ref("上拉加载更多"); // 底部提示文字
const isLoading = ref(false); // 是否正在加载
let lastLoadTime = 0; // 上次触发加载的时间
const LOAD_INTERVAL = 500; // 加载节流（ms）

// ====================== 数据存储 ======================
const treeData = ref({
  userEnergy: 0, // 当前用户能量
  total: 0, // 总条数
  page: 1, // 当前页（后端返回）
  pageSize: 10, // 每页条数（后端返回）
  treeType: [], // 树数据列表
});

const NodataShow = ref(false); // 是否显示“暂无数据”

// ====================== 虚拟滚动参数 ======================
const rowHeight = uni.rpx2px(400); // 每行高度（单位 px）
const viewportHeight = ref(uni.rpx2px(1200)); // 可视区域高度（单位 px）
const itemsPerRow = 2; // 每行固定 2 个卡片
const startRowIndex = ref(0); // 当前滚动位置对应的起始行索引
const BUFFER_ROWS = 2; // 上下缓冲的行数（避免白屏）

// ====================== 计算属性 ======================
/**
 * 计算整个列表的总高度（撑起滚动条）
 */
const totalHeight = computed(() => {
  const rowCount = Math.ceil(treeData.value.treeType.length / itemsPerRow);
  return rowCount * rowHeight;
});

/**
 * 计算当前应该渲染的数据（虚拟列表核心）
 */
const visibleData = computed(() => {
  // 根据滚动位置，确定起始行
  const rowStart = Math.max(0, startRowIndex.value - BUFFER_ROWS);
  // 终止行
  const rowEnd =
    rowStart + Math.ceil(viewportHeight.value / rowHeight) + BUFFER_ROWS * 2;

  // 转换成数组索引
  // 规律 第0行 → 起点下标 0 第1行 → 起点下标 2 第2行 → 起点下标 4
  const start = rowStart * itemsPerRow;
  const end = rowEnd * itemsPerRow;

  return treeData.value.treeType.slice(start, end);
});

/**
 * 偏移量（让渲染出来的卡片“移动”到正确位置）
 */
const offsetY = computed(() => {
  return Math.max(0, (startRowIndex.value - BUFFER_ROWS) * rowHeight);
});

// ====================== 方法 ======================
/**
 * 获取树列表
 */
const getTreeList = async () => {
  uni.showLoading({ title: "加载中" });

  // 先刷新 token
  const verify = await NewAccesstoken();
  if (!verify) {
    uni.hideLoading();
    return;
  }

  try {
    // 发起请求
    const res = await uni.request({
      url: `${BaseUrl}/tree/getTree`,
      method: "GET",
      header: { authorization: `Bearer ${tokenStore.Accesstoken}` },
      data: { page: page.value, pageSize: pageSize.value },
    });

    if (res.data.status !== 200) throw new Error();

    // 如果是第一页，直接覆盖
    if (page.value === 1) {
      treeData.value = res.data.data;
      NodataShow.value = treeData.value.treeType.length === 0;
    } else {
      // 否则拼接数据
      treeData.value.treeType.push(...res.data.data.treeType);
    }

    // 判断是否还有更多数据
    if (treeData.value.treeType.length >= treeData.value.total) {
      status.value = "noMore";
      contentText.value = "没有更多数据了";
    } else {
      status.value = "more";
      contentText.value = "上拉加载更多";
    }

    uni.hideLoading();
  } catch (e) {
    uni.showToast({ title: "请求错误", icon: "error" });
    uni.hideLoading();
  }
};

/**
 * 滚动事件
 * @param {Object} e scroll 事件对象
 */
const onScroll = (e) => {
  startRowIndex.value = Math.floor(e.detail.scrollTop / rowHeight);
};

/**
 * 滚动到底部加载更多
 */
const onScrollToLower = async () => {
  const now = Date.now();
  // 节流，避免频繁触发
  if (now - lastLoadTime < LOAD_INTERVAL) return;
  lastLoadTime = now;

  // 加载锁 正在加载就先别获取了
  if (isLoading.value) return;
  if (treeData.value.treeType.length >= treeData.value.total) return;

  isLoading.value = true;
  status.value = "loading";
  contentText.value = "正在加载...";
  page.value += 1;

  await getTreeList();
  isLoading.value = false;
};

// ====================== 生命周期 ======================
onMounted(() => {
  getTreeList(); // 初始化时加载数据
});
</script>

<template>
  <view class="page">
    <!-- 返回按钮 -->
    <AutoBackVue />

    <!-- 无数据展示 -->
    <NoDataVue v-if="NodataShow" />

    <!-- 顶部背景和标题 -->
    <uni-row>
      <uni-col>
        <image
          class="bg-img"
          src="https://s21.ax1x.com/2024/09/15/pAuDYcT.jpg"
        />
      </uni-col>
      <uni-col span="20" offset="2">
        <TreeTitleVue />
      </uni-col>
    </uni-row>

    <!-- 树列表 -->
    <uni-row>
      <uni-col span="24" offset="0">
        <scroll-view
          class="viewport"
          ref="viewport"
          scroll-y
          @scroll="onScroll"
          @scrolltolower="onScrollToLower"
        >
          <!-- 占位高度（撑起滚动条） -->
          <view :style="{ height: totalHeight + 'px' }"></view>

          <!-- 实际渲染的内容，利用 transform 偏移到正确位置 -->
          <view
            class="treelist"
            :style="{ transform: `translateY(${offsetY}px)` }"
          >
            <TreeCardVue
              v-for="item in visibleData"
              :key="item.id"
              :currentEnergy="treeData.userEnergy"
              :totalEnergy="item.energy"
              :show="true"
              @clickbtn="todeail(item.id)"
            >
              <!-- 左侧文本信息 -->
              <template #left>
                <p>{{ item.scientific_name }}</p>
                <p>总数：{{ item.total }}颗</p>
                <p>剩余数量：</p>
                <p>{{ item.remaining }}颗</p>
              </template>

              <!-- 图片（懒加载） -->
              <template #image>
                <image :src="item.avatar" lazy-load></image>
              </template>

              <!-- 按钮 -->
              <template #btn>去了解</template>
            </TreeCardVue>
          </view>

          <!-- 底部加载更多 -->
          <view class="load-more">
            <uni-load-more :status="status" :content-text="contentText" />
          </view>
        </scroll-view>
      </uni-col>
    </uni-row>
  </view>
</template>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.bg-img {
  width: 100%;
  position: absolute;
  top: -165rpx;
  z-index: 1;
  height: 410rpx;
}

/* 树列表改成 grid 布局，保证每行固定 2 个元素 */
.treelist {
  width: 94%;
  padding-left: 3%;
  padding-right: 3%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 25rpx;
  position: absolute;
  top: 0;
}

.load-more {
  width: 100%;
  display: flex;
  justify-content: center;
}

::v-deep .uni-load-more {
  height: 100rpx;
}

.viewport {
  width: 100%;
  height: 1200rpx;
  overflow-y: auto;
  /* border: 1px solid #ccc; */
  position: relative;
}
</style>
