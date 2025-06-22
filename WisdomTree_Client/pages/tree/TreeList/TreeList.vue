<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import TreeCardVue from "../../../components/tree/TreeCard.vue";
import TreeTitleVue from "../../../components/tree/TreeTitle.vue";
import { useTokenStore } from "@/stores/token";
import { ref } from "vue";
import { NewAccesstoken } from "../../../common/request";
import { BaseUrl } from "../../../common/request";
import NoDataVue from "../../../components/NoData.vue";

const tokenStore = useTokenStore();

const todeail = (id) => {
  // 跳转传参
  uni.navigateTo({
    url: `/pages/tree/TreeDetail/TreeDetail?treeTypeID=${id}`,
  });
};

const treeList = ref({});

const NodataShow = ref(false);
// 获取树列表
const getTreeList = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken();
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/tree/getTree`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error();
      }
      treeList.value = res.data.data;
      if (treeList.value.treeType.length === 0) {
        NodataShow.value = true;
        uni.hideLoading();
      }
    } catch (e) {
      uni.showToast({
        title: `请求错误`,
        icon: "error",
      });
    }
  } else {
    uni.hideLoading();
  }
};

const load = () => {
  uni.hideLoading();
};

getTreeList();
</script>

<template>
  <view class="page">
    <AutoBackVue />
    <NoDataVue v-if="NodataShow" />
    <!-- 步骤 -->
    <uni-row>
      <uni-col>
        <image
          class="bg-img"
          src="https://s21.ax1x.com/2024/09/15/pAuDYcT.jpg"
          mode=""
        ></image>
      </uni-col>
      <uni-col span="20" offset="2">
        <TreeTitleVue />
      </uni-col>
    </uni-row>

    <!-- 树列表 -->
    <uni-row>
      <uni-col span="22" offset="1">
        <view class="treelist">
          <TreeCardVue
            @clickbtn="todeail(item.id)"
            v-for="item in treeList.treeType"
            :key="item.id"
            :currentEnergy="treeList.userEnergy"
            :totalEnergy="item.energy"
            :show="true"
          >
            <template #left>
              <p>{{ item.scientific_name }}</p>
              <p>总数：{{ item.total }}颗</p>
              <p>剩余数量：</p>
              <p>{{ item.remaining }}颗</p>
            </template>
            <template #image>
              <image :src="item.avatar" @load="load"></image>
            </template>
            <template #btn>去了解</template>
          </TreeCardVue>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<style scoped>
@import url("../../../static/css/treelist.css");
</style>
