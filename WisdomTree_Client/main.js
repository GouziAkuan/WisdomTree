import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";
import { createUnistorage } from "./uni_modules/pinia-plugin-unistorage";

// 导出一个函数，用于创建SSR App
export function createApp() {
  const app = createSSRApp(App);

  // 创建 Pinia 实例
  const store = Pinia.createPinia();

  // 使用 uni 的本地存储插件
  store.use(createUnistorage());

  // 将 Pinia 实例挂载到 Vue 应用上
  app.use(store);

  return {
    app,
    Pinia, // 此处必须将 Pinia 返回
  };
}
