<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import { BaseUrl } from "../../../common/request";
import { NewAccesstoken } from "../../../common/request";
import { useTokenStore } from "@/stores/token";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const tokenStore = useTokenStore();

const oneimage = ref({
  url: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao-small.jpg",
  extname: "jpg",
  name: "user.jpg",
});

const imageStyles = ref({
  width: 90,
  height: 90,
  border: {
    radius: "50%",
  },
});

// 上传头像
const select = async (e) => {
  // 检验图片大小不超过5mb
  if (e.tempFiles[0].size > 3 * 1024 * 1024) {
    uni.showToast({
      title: "不能超过3MB",
      icon: "error",
    });
    return;
  }
  const tempFilePaths = e.tempFilePaths;
  const res = await uni.uploadFile({
    url: `${BaseUrl}/file/upload`,
    filePath: tempFilePaths[0],
    name: "file",
  });
  const resdata = JSON.parse(res.data);
  formData.value.avatar = resdata.path;
};

// 删除头像
const del = (e) => {
  formData.value.avatar = "";
  console.log(formData.value.avatar);
};

// 表单实例引用
const form = ref(null);
// 表单数据
const formData = ref({
  username: "",
  avatar: "",
  phone: "",
});

onLoad((option) => {
  uni.showLoading({
    title: "加载中",
  });
  const optionObj = JSON.parse(decodeURIComponent(option.userInfoStr));
  oneimage.value.url = optionObj.avatar;
  formData.value = optionObj;
  // 隐藏加载
  uni.hideLoading();
});

// 表单验证
const rules = ref({
  username: {
    rules: [
      {
        required: true,
        errorMessage: "请输入用户昵称",
      },
    ],
  },
  phone: {
    rules: [
      {
        required: true,
        errorMessage: "请输入手机号",
      },
      {
        pattern: /^1[3-9]\d{9}$/,
        errorMessage: "请输入有效手机号",
      },
    ],
  },
});
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

const submitForm = async () => {
  uni.showLoading({
    title: "修改中",
  });
  const verify = await NewAccesstoken(tokenStore.Accesstoken);
  if (verify) {
    try {
      const res = await uni.request({
        url: `${BaseUrl}/user/updateInfo`,
        method: "PUT",
        header: {
          authorization: `Bearer ${tokenStore.Accesstoken}`,
        },
        data: {
          ...formData.value,
        },
      });
      if (res.data.status !== 200) {
        throw new Error();
      }
      uni.hideLoading();
      // 提示
      uni.showToast({
        title: "修改成功",
        icon: "success",
      });
    } catch (e) {
      uni.hideLoading();
      uni.showToast({
        title: `请求错误`,
        icon: "error",
      });
    }
  }
};
</script>

<template>
  <view class="page">
    <AutoBackVue />
    <!-- 头像 昵称 部分 -->
    <uni-row>
      <uni-col>
        <view class="user-info">
          <view class="user-info__avatar">
            <uni-file-picker
              v-model="oneimage"
              limit="1"
              return-type="object"
              file-mediatype="image"
              disable-preview
              :del-icon="false"
              :image-styles="imageStyles"
              @select="select"
              @delete="del"
            />
          </view>
        </view>
      </uni-col>
    </uni-row>

    <!-- 修改个人信息 -->
    <uni-row>
      <uni-col span="22" offset="1">
        <view class="treeForm-box">
          <view class="From-title">个人信息</view>
          <!--  -->
          <uni-forms
            ref="form"
            :model="formData"
            :rules="rules"
            err-show-type="toast"
          >
            <view class="from-tiem">
              <p class="fromtitle">用户名称</p>
              <uni-forms-item name="username">
                <input
                  type="nickname"
                  placeholder="请输入"
                  v-model="formData.username"
                />
              </uni-forms-item>
            </view>
            <view class="from-tiem">
              <p class="fromtitle">手机号</p>
              <uni-forms-item name="phone">
                <input placeholder="请输入" v-model="formData.phone" />
              </uni-forms-item>
            </view>
          </uni-forms>
        </view>
      </uni-col>
    </uni-row>

    <!-- 按钮 -->
    <uni-row>
      <uni-col span="22" offset="1">
        <view class="btn-box" @click="submit">
          <p>修改</p>
        </view>
      </uni-col>
    </uni-row>
  </view>
</template>

<style scoped>
@import url("../../../static/css/updateinfo.css");
</style>
