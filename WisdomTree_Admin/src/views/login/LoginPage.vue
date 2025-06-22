<script setup>
import LoginForm from '@/components/login/LoginForm.vue'
import logo from '@/assets/images/logo.jpg'
</script>

<template>
  <div class="bg"></div>
  <div class="login-card">
    <el-row>
      <el-col :span="10" :offset="7">
        <el-card style="width: 100%" shadow="always">
          <div class="login-all">
            <div class="login-header">
              <img class="logo" :src="logo" />
              <h1>绿影慧领后台管理系统</h1>
            </div>
            <LoginForm />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
@import url('/src/assets/css/login.css');
</style>
