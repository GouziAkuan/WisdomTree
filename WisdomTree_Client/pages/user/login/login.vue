<script setup>
import StatusBar from "../../../components/StatusBar.vue";
import { ref } from "vue";
import { BaseUrl } from "../../../common/request";
import { useTokenStore } from "@/stores/token";
import { NewAccesstoken } from "../../../common/request";
import { onLoad } from "@dcloudio/uni-app";

const tokenStore = useTokenStore();

// 自动登录
const autoLogin = async () => {
  // 是否登录过
  if (tokenStore.RefreshToken) {
    // 如果登录过，则自动登录
    // 调用刷新token接口
    const refreshRes = await NewAccesstoken();
    if (refreshRes) {
      uni.navigateTo({
        url: "/pages/index/index",
      });
      uni.showToast({
        title: "登录成功",
        icon: "success",
      });
    }
  } else {
    // 如果未登录过，则跳转到登录页面
    uni.showToast({
      title: "未登录",
      icon: "error",
      duration: 2000,
    });
  }
};

onLoad(() => {
  autoLogin();
});

// 表单数据
const fromdata = ref({
  username: "",
  password: "",
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
};

// 表单实例引用
const form = ref(null);

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
    const res = await uni.request({
      url: `${BaseUrl}/user/login`,
      method: "POST",
      data: {
        username: fromdata.value.username,
        password: fromdata.value.password,
      },
    });
    // 错误处理
    if (res.data.status === 400) {
      uni.showToast({
        title: `${res.data.message}`,
        icon: "error",
      });
      return;
    }
    // 存token
    tokenStore.saveToken(res.data.data.accessToken);
    tokenStore.saveRefreshToken(res.data.data.refreshToken);
    uni.redirectTo({
      url: "/pages/index/index",
    });
    // 成功提示
    uni.showToast({
      title: "登录成功",
      icon: "success",
    });
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <StatusBar></StatusBar>
  <view class="v1">
    <!-- 宣传语 -->
    <uni-row>
      <uni-col>
        <view class="v2">
          <p class="p1">
            欢迎登录,
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
        </uni-forms>
        <!-- 提交按钮 -->
        <button class="subbtn" @click="submitForm">登录</button>
      </uni-col>
    </uni-row>
    <uni-row>
      <uni-col>
        <p class="ysp">
          <navigator
            class="ysp-a"
            hover-class="none"
            url="/pages/user/register/register"
            >没有账号？去注册</navigator
          >
        </p>
      </uni-col>
    </uni-row>
    <!-- 隐私协议 -->
    <uni-row>
      <uni-col>
        <p class="ysp">
          登录即表示同意
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
