<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import BasicInfoVue from "../../../components/tree/BasicInfo.vue";
import TreePlateVue from "../../../components/tree/TreePlate.vue";
import TreeDeailVue from "../../../components/tree/TreeDeail.vue";
import TreeImageVue from "../../../components/tree/TreeImage.vue";
import WishComVue from "../../../components/tree/WishCom.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { NewAccesstoken } from "../../../common/request";
import { BaseUrl } from "../../../common/request";
import { useTokenStore } from "@/stores/token";
import { dayjs } from "@/uni_modules/iRainna-dayjs/js_sdk/dayjs.min.js";

const tokenStore = useTokenStore();

const treeInfo = ref({
  id: 1,
  adoption_id: "领养编号",
  nickname: "领养昵称",
  tree_type: "树木类型",
  adopted_at: "领养时间",
  avatar: "http://127.0.0.1:8080/static/mrtx.png",
  scientific_name: "学名",
  common_name: "俗名",
  description: "详情",
  total: "树木总数",
  wish: "心愿",
  remaining: "剩余数量",
  detailImage: ["http://127.0.0.1:8080/static/mrtx.png"],
  area: "区域",
});

onLoad((option) => {
  getTreeDeailInfo(option.adoptID);
});

// 获取树详情
const getTreeDeailInfo = async (adoptID) => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken(tokenStore.Accesstoken);
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/tree/getUserTreeDetail?adoptID=${adoptID}`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error();
      }
      treeInfo.value = res.data.data;
      // 将 treeInfo.value.adopted_at 转换为年-月-日格式
      treeInfo.value.adopted_at = dayjs(treeInfo.value.adopted_at).format(
        "YYYY-MM-DD"
      );
    } catch (e) {
      uni.showToast({
        title: `请求错误`,
        icon: "error",
      });
    }
  }
};

// 预览图片操作
const imageClick = () => {
  uni.previewImage({
    urls: treeInfo.value.detailImage,
    loop: true,
    showmenu: true,
  });
};

const load = () => {
  uni.hideLoading();
};
</script>

<template>
  <view class="page">
    <!-- 自定义导航组件 -->
    <AutoBackVue />
    <!-- 基本信息组件 -->
    <BasicInfoVue>
      <template #info-name>{{ treeInfo.scientific_name }}</template>
      <template #info-smname>{{ treeInfo.common_name }}</template>
      <template #touxiang>
        <image :src="treeInfo.avatar"></image>
      </template>
    </BasicInfoVue>
    <!-- 心愿组件 -->
    <WishComVue>
      <template>
        <p>{{ treeInfo.wish }}</p>
        <p>{{ treeInfo.adopted_at }}</p>
      </template>
    </WishComVue>
    <!-- 树木铭牌组件 -->
    <TreePlateVue>
      <p class="mp-p">
        树种
        <span class="mp-span">{{ treeInfo.scientific_name }}</span>
      </p>
      <p class="mp-p">
        树木类型
        <span class="mp-span">{{ treeInfo.tree_type }}</span>
      </p>
      <p class="mp-p">
        领养区域
        <span class="mp-span" style="color: #64bc96">{{ treeInfo.area }}</span>
      </p>
      <p class="mp-p">
        领养昵称
        <span class="mp-span">{{ treeInfo.nickname }}</span>
      </p>
      <p class="mp-p">
        领养编号
        <span class="mp-span bh">{{ treeInfo.adoption_id }}</span>
      </p>
      <p class="mp-p">
        领养时间
        <span class="mp-span">{{ treeInfo.adopted_at }}</span>
      </p>
      <p class="mp-p">
        总数
        <span class="mp-span num">{{ treeInfo.total }} 颗</span>
      </p>
      <p class="mp-p">
        剩余数量
        <span class="mp-span sy">{{ treeInfo.remaining }} 颗</span>
      </p>
    </TreePlateVue>
    <!-- 树木详情组件 -->
    <TreeDeailVue>
      <template>
        {{ treeInfo.description }}
      </template>
    </TreeDeailVue>
    <!-- 树木照片组件 -->
    <TreeImageVue>
      <template v-for="(item, index) in treeInfo.detailImage" :key="index">
        <image
          :src="item"
          mode="aspectFill"
          @click="imageClick"
          @load="load"
        ></image>
      </template>
    </TreeImageVue>
    <!-- 因为BuyNow组件底部占位div -->
    <view class="zw"></view>
  </view>
</template>

<style>
@import url("/static/css/userdeail.css");
</style>
