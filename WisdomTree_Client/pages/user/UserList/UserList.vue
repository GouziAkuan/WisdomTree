<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import TreeCardVue from "../../../components/tree/TreeCard.vue";
import TreeTitleVue from "../../../components/tree/TreeTitle.vue";
import { ref } from "vue";
import { NewAccesstoken } from "../../../common/request";
import { BaseUrl } from "../../../common/request";
import { useTokenStore } from "@/stores/token";
import NoDataVue from "../../../components/NoData.vue";

const todeail = (id) => {
  uni.navigateTo({
    url: `/pages/user/UserDeail/UserDeail?adoptID=${id}`,
  });
};

const tokenStore = useTokenStore();

const treeList = ref([]);

const NodataShow = ref(false);
// 获取树列表
const getTreeList = async () => {
  uni.showLoading({
    title: "加载中",
  });
  const verify = await NewAccesstoken(tokenStore.Accesstoken);
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/tree/getUserTree`,
        method: "GET",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
      });
      if (res.data.status !== 200) {
        throw new Error();
      }
      treeList.value = res.data.data;
      if (treeList.value.length === 0) {
        NodataShow.value = true;
        uni.hideLoading();
      }
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

getTreeList();
</script>

<template>
  <view class="page">
    <AutoBackVue />
    <NoDataVue v-if="NodataShow" />
    <!-- 树列表 -->
    <uni-row>
      <uni-col span="22" offset="1">
        <view class="treelist">
          <TreeCardVue
            @clickbtn="todeail(item.id)"
            v-for="item in treeList"
            :key="item.id"
          >
            <template #left>
              <p>{{ item.scientific_name }}</p>
              <p>已领养</p>
              <p>{{ item.tree_type }}</p>
            </template>
            <template #image>
              <image :src="item.avatar" @load="load"></image>
            </template>
            <template #btn>去查看</template>
          </TreeCardVue>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<style scoped>
@import url("/static/css/userlist.css");
</style>
