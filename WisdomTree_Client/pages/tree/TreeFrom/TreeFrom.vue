<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import TreeCardVue from "../../../components/tree/TreeCard.vue";
import TreeTitleVue from "../../../components/tree/TreeTitle.vue";
import BuyNowVue from "../../../components/tree/BuyNow.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { NewAccesstoken } from "../../../common/request";
import { BaseUrl } from "../../../common/request";
import { useTokenStore } from "@/stores/token";
import { medalStore } from "../../../stores/medal";

onLoad((option) => {
  uni.showLoading({
    title: "加载中",
  });
  treeTypeID.value = option.treeTypeID;
  treeName.value = option.treeName;
  avatar.value = option.avatar;
});

// 上页传来的数据
const treeName = ref("默认");

const avatar = ref("https://s21.ax1x.com/2024/09/15/pAuDlAs.jpg");

//
const tokenStore = useTokenStore();

const medal = medalStore();

const treeTypeID = ref("");

// 表单实例引用
const form = ref(null);
// 选择器数据
const treeType = [
  "爱情纪念树",
  "友情纪念树",
  "亲情纪念树",
  "青春纪念树",
  "事业纪念树",
  "平安纪念树",
];
const region = ["图书馆", "食堂", "教学楼", "运动场", "寝室"];
// 表单数据
const formData = ref({
  nickName: "",
  treeType: treeType[0],
  wish: "",
  area: region[0],
});
// 表单验证
const rules = ref({
  nickName: {
    rules: [
      {
        required: true,
        errorMessage: "请输入姓名/昵称",
      },
    ],
  },
});

// 选择器处理
// 树类型默认值
const index = ref(0);
// 选择器事件
const bindPickerChange = (e) => {
  index.value = e.detail.value;
  // 绑定表单数据
  formData.value.treeType = treeType[e.detail.value];
};

// 区域类型默认值
const regionIndex = ref(0);
const RegionChange = (e) => {
  regionIndex.value = e.detail.value;
  formData.value.area = region[e.detail.value];
};

// 提交表单
const submit = async () => {
  // 执行验证
  const { valid, errors } = await form.value.validate();
  if (valid == null) {
    // 表单校验成功
    console.log("校验成功");
    submitForm();
  } else {
    // 表单校验失败
    console.log("校验失败", errors);
  }
};

// 后端提交表单
const submitForm = async () => {
  uni.showLoading({
    title: "领养中",
  });
  const verify = await NewAccesstoken(tokenStore.Accesstoken);
  if (verify) {
    try {
      if (formData.value.wish === "") {
        formData.value.wish = "向下扎根,向上生长,初心不改，未来可期!";
      }
      console.log(formData.value);
      const res = await uni.request({
        url: `${BaseUrl}/tree/adoptTree`,
        method: "POST",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
        data: {
          treeTypeID: Number(treeTypeID.value),
          ...formData.value,
        },
      });
      if (res.data.status !== 200) {
        throw new Error();
      }
      uni.hideLoading();
      // 提示
      uni.showToast({
        title: "领养成功",
        icon: "success",
      });
      const medalInfo = {
        ...res.data.data,
        avatar: avatar.value,
      };
      // 存入勋章信息
      medal.saveMedalInfo(medalInfo);
      // 等一秒
      setTimeout(() => {
        // 跳转页面
        uni.reLaunch({
          url: "/pages/index/index?AutoLogin=false",
        });
      }, 500);
    } catch (e) {
      uni.hideLoading();
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
    <AutoBackVue />
    <!-- 领养按钮组件 -->
    <BuyNowVue @submit="submit">
      <template #xy>
        <p class="ysp">
          领养即表示同意
          <navigator class="ysp-a" hover-class="none">《领养协议》</navigator>
        </p>
      </template>
    </BuyNowVue>
    <image
      class="bg-img"
      src="https://s21.ax1x.com/2024/09/15/pAuDtjU.jpg"
    ></image>
    <!-- 步骤 -->
    <uni-row>
      <uni-col span="20" offset="2">
        <TreeTitleVue>
          <text>第二步</text>
          <text>与我的小树建立连接</text>
          <template #image>
            <image :src="avatar" @load="load"></image>
          </template>
        </TreeTitleVue>
      </uni-col>
    </uni-row>

    <!-- 表单 -->
    <uni-row>
      <uni-col span="20" offset="2">
        <view class="treeForm-box">
          <view class="From-title">领养信息</view>
          <view class="treetitel">
            <text>树木品种</text>
            <text>{{ treeName }}</text>
          </view>
          <!--  -->
          <uni-forms
            ref="form"
            :model="formData"
            :rules="rules"
            err-show-type="toast"
          >
            <view class="from-tiem">
              <p class="fromtitle">姓名/昵称</p>
              <uni-forms-item name="nickName">
                <input placeholder="请输入" v-model="formData.nickName" />
              </uni-forms-item>
            </view>
            <view class="from-tiem">
              <p class="fromtitle">领养区域</p>
              <uni-forms-item name="region">
                <picker
                  @change="RegionChange"
                  value="regionIndex"
                  :range="region"
                >
                  <view class="uni-input">{{ region[regionIndex] }}</view>
                </picker>
              </uni-forms-item>
            </view>
            <view class="from-tiem">
              <p class="fromtitle">纪念树类型</p>
              <uni-forms-item name="treeType">
                <picker
                  @change="bindPickerChange"
                  value="index"
                  :range="treeType"
                >
                  <view class="uni-input">{{ treeType[index] }}</view>
                </picker>
              </uni-forms-item>
            </view>
            <view class="from-tiem-xy">
              <p class="fromtitle">我的心愿</p>
              <uni-forms-item name="wish">
                <textarea
                  maxlength="30"
                  class="xytext"
                  v-model="formData.wish"
                  placeholder="向下扎根,向上生长,初心不改，未来可期!"
                />
              </uni-forms-item>
            </view>
          </uni-forms>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<style scoped>
@import url("/static/css/treeform.css");
</style>
