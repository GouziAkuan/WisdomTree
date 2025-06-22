<script setup>
import AutoBackVue from "../../../components/AutoBack.vue";
import { ref } from "vue";
import { BaseUrl } from "../../../common/request";

const imageStyles = ref({
  width: 65,
  height: 65,
  border: {
    radius: "50%",
    color: "#f0f0f0",
  },
});

// 表单数据
const fromdata = ref({
  avatar: "",
  username: "",
  password: "",
  phone: "",
});

// 表单校验
const rules = {
  username: {
    rules: [
      {
        required: true,
        errorMessage: "请输入用户名",
      },
    ],
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: "请输入密码",
      },
    ],
  },

  phone: {
    rules: [
      {
        required: true,
        errorMessage: "请输入手机号",
      },
      // 检验是否为手机号
      {
        pattern: /^1[3456789]\d{9}$/,
        errorMessage: "请输入正确的手机号",
      },
    ],
  },
};

// 表单实例引用
const form = ref(null);

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
  fromdata.value.avatar = resdata.path;
};

// 删除头像
const del = (e) => {
  fromdata.value.avatar = "";
  console.log(fromdata.value.avatar);
};

// 提交函数
const submitForm = async () => {
  if (!form.value) return;

  // 执行验证
  const { valid, errors } = await form.value.validate();
  if (valid == null) {
    // 表单校验成功
    console.log("校验成功");
    submitFormToBack();
  } else {
    // 表单校验失败
    console.log("校验失败", errors);
  }
};

// 提交表单到后端
const submitFormToBack = async () => {
  try {
    //  微信登录获取 code
    const loginRes = await uni.login({
      provider: "weixin",
    });

    const res = await uni.request({
      url: `${BaseUrl}/user/create`,
      method: "POST",
      data: {
        avatar: fromdata.value.avatar,
        username: fromdata.value.username,
        password: fromdata.value.password,
        phone: fromdata.value.phone,
        code: loginRes.code,
      },
    });
    if (res.data.status === 400) {
      uni.showToast({
        title: `${res.data.message}`,
        icon: "error",
      });
      return;
    }

    // 跳转到登录
    uni.navigateTo({
      url: "/pages/user/login/login",
    });
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <AutoBackVue />
  <view class="v1">
    <!-- 宣传语 -->
    <uni-row>
      <uni-col>
        <view class="v2">
          <p class="p1">
            欢迎注册,
            <span class="p2">绿影慧领</span>
          </p>

          <p class="p3">一个便捷的树木认养平台</p>
        </view>
      </uni-col>
    </uni-row>
    <!-- 表单部分 -->
    <uni-row>
      <uni-col :span="21" :offset="1">
        <uni-forms
          ref="form"
          :model="fromdata"
          :rules="rules"
          validate-trigger="bind"
        >
          <uni-forms-item name="avatar">
            <uni-file-picker
              limit="1"
              return-type="object"
              file-mediatype="image"
              :image-styles="imageStyles"
              disable-preview
              :del-icon="false"
              @select="select"
              @delete="del"
            />
            <p class="sm">选择头像</p>
          </uni-forms-item>
          <uni-forms-item name="username">
            <input
              type="nickname"
              class="sbzzinput"
              v-model="fromdata.username"
              placeholder="请输入用户名"
            />
          </uni-forms-item>
          <uni-forms-item name="password">
            <input
              type="password"
              class="sbzzinput"
              v-model="fromdata.password"
              placeholder="请输入密码"
            />
          </uni-forms-item>
          <uni-forms-item name="phone">
            <input
              type="text"
              class="sbzzinput"
              v-model="fromdata.phone"
              placeholder="请输入手机号"
            />
          </uni-forms-item>
        </uni-forms>
        <!-- 提交按钮 -->
        <button class="subbtn" @click="submitForm">注册</button>
      </uni-col>
    </uni-row>
    <uni-row>
      <uni-col>
        <p class="ysp">
          <navigator
            class="ysp-a"
            hover-class="none"
            url="/pages/user/login/login"
            >已有账号？去登录</navigator
          >
        </p>
      </uni-col>
    </uni-row>
    <!-- 隐私协议 -->
    <uni-row>
      <uni-col>
        <p class="ysp">
          注册即表示同意
          <navigator class="ysp-a" hover-class="none">《用户协议》</navigator>
          <navigator class="ysp-a" hover-class="none">《隐私政策》</navigator>
        </p>
      </uni-col>
    </uni-row>
  </view>
</template>

<style scoped>
@import url("../../../static/css/register.css");
</style>
