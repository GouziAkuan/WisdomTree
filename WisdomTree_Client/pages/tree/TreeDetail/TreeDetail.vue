<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import TreeTitleVue from "../../../components/tree/TreeTitle.vue";
import BuyNowVue from "../../../components/tree/BuyNow.vue";
import BasicInfoVue from "../../../components/tree/BasicInfo.vue";
import TreePlateVue from "../../../components/tree/TreePlate.vue";
import TreeDeailVue from "../../../components/tree/TreeDeail.vue";
import TreeImageVue from "../../../components/tree/TreeImage.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { NewAccesstoken } from "../../../common/request";
import { BaseUrl } from "../../../common/request";
import { useTokenStore } from "@/stores/token";

const tokenStore = useTokenStore();

const toform = (treeTypeID, treeName, avatar) => {
  uni.navigateTo({
    url: `/pages/tree/TreeFrom/TreeFrom?treeTypeID=${treeTypeID}&treeName=${treeName}&avatar=${avatar}`,
  });
};

const treeTypeInfo = ref({
  id: 1,
  avatar: "https://s21.ax1x.com/2024/09/15/pAuDlAs.jpg",
  scientific_name: "学名",
  common_name: "俗名",
  description: "详情",
  total: "树木总数",
  remaining: "剩余数量",
});

// onload
onLoad((option) => {
  getTreeTypeInfo(option.treeTypeID);
});

// 获取树类详情
const getTreeTypeInfo = async (treeTypeID) => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken(tokenStore.Accesstoken);
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/tree/getTreeDetail?treeTypeID=${treeTypeID}`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error();
      }
      treeTypeInfo.value = res.data.data;
    } catch (e) {
      uni.showToast({
        title: `请求错误`,
        icon: "error",
      });
    }
  }
};

const load = () => {
  uni.hideLoading();
};
</script>

<template>
  <view class="page">
    <!-- 自定义导航组件 -->
    <AutoBackVue />
    <!-- 领养按钮组件 -->
    <BuyNowVue
      @submit="
        toform(
          treeTypeInfo.id,
          treeTypeInfo.scientific_name,
          treeTypeInfo.avatar
        )
      "
    >
      <template #text>
        <p>填写领养信息</p>
      </template>
    </BuyNowVue>
    <!-- 基本信息组件 -->
    <BasicInfoVue>
      <template #info-name>{{ treeTypeInfo.scientific_name }}</template>
      <template #info-smname>{{ treeTypeInfo.common_name }}</template>
      <template #touxiang>
        <image :src="treeTypeInfo.avatar" @load="load"></image>
      </template>
    </BasicInfoVue>
    <!-- 树木铭牌组件 -->
    <TreePlateVue
      :show="true"
      :currentEnergy="treeTypeInfo.userEnergy"
      :totalEnergy="treeTypeInfo.energy"
    >
      <p class="mp-p">
        树种
        <span class="mp-span">{{ treeTypeInfo.scientific_name }}</span>
      </p>
      <p class="mp-p">
        总数
        <span class="mp-span num">{{ treeTypeInfo.total }} 颗</span>
      </p>
      <p class="mp-p">
        剩余数量
        <span class="mp-span sy">{{ treeTypeInfo.remaining }} 颗</span>
      </p>
    </TreePlateVue>
    <!-- 树木详情组件 -->
    <TreeDeailVue>
      <template>
        {{ treeTypeInfo.description }}
      </template>
    </TreeDeailVue>
    <!-- 因为BuyNow组件底部占位div -->
    <view class="zw"></view>
  </view>
</template>

<style>
@import url("../../../static/css/treedeail.css");
</style>
