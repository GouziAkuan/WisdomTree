# 绿影慧领个性化树木领养系统

**项目简介**  
基于 Nest.js + Vue3 技术栈构建校园绿化数字化管理平台，融合 AI 智能识别与 3D 可视化技术，打造“管理—参与—教育”三位一体的绿色社区。后端采用 Nest.js 模块化架构（TypeORM + MySQL），集成阿里云通义大模型实现树木智能识别与养护建议；前端基于 Vue3 + uni-app 开发跨平台小程序和管理系统系统，结合 Three.js 构建 3D 校园地图与养护教学场景，通过 ECharts 实现多维度数据看板。核心功能涵盖：个性化树木领养管理、AI 图像识别与养护方案生成、3D 校园分布地图和 3D 树木领养模型、环保论坛与活动运营体系、积分激励与能量互动系统。项目以模块化设计支持高并发场景，兼顾性能与扩展性，为高校生态素质教育提供数字化解决方案。

---

**技术栈**

- **后端**：Nest.js（模块化架构）、TypeORM（MySQL 数据操作）、阿里云通义大模型（AI 识别）。
- **小程序**：Vue3 + uni-app（跨平台小程序）、Pinia、ECharts（数据可视化）。
- **管理端**：Vue3 + Vite + Element Plus（UI 框架）、ECharts（数据可视化）、Three.js（3D 地图）。
- **功能亮点**：大模型选用 Qwen，支持 AI 识别树木状态、AI 养护建议、3D 动态热力地图、3D 树木模型、树木全生命周期管理、游戏化积分激励、解密微信数据转换能量球。
- **性能优化**：无限滚动、虚拟列表和懒加载，优化长列表数据渲染性能，提升大数据量展示时的流畅度；优化 3D 渲染性能，合理复用几何体与材质，支持窗口自适应与资源自动清理，保障大场景流畅运行；与微信账号绑定，设置步数阈值防止刷步数

---

**核心功能**

1. **用户端**（小程序）已上线体验版 重新注册账号即可或使用（akuan 123456）登录

   扫码等待审核，注意打开调试模式（然后重新启动小程序），步骤如下：

   <img src="https://youke1.picui.cn/s1/2025/08/21/68a72fd19211e.png" width="300" height="300"/>
   <br/>
   <img src="https://youke1.picui.cn/s1/2025/08/21/68a72fd1b424f.png" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/21/68a7308181905.jpeg" width="300" height="650"/>

   - 树木个性化领养与成长档案管理
   - AI 图像识别与养护方案生成
   - 环保论坛与活动运营
   - 微信步数兑换能量积分与互动激励
   - 积分机制领养树木
   - 无限滚动、虚拟列表和懒加载，优化长列表数据渲染性能，提升大数据量展示时的流畅度

   界面截图:
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae16c36922.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae16ee6ab6.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae16f576b9.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae16f9f8d2.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae16f0bac7.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae17129600.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae1747cc04.jpg" width="300" height="650"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae17551d80.jpg" width="300" height="650"/>

2. **管理端**（Web）已上线 体验账号 GucTree 123456

   - 上线地址:https://admin-165494-6-1348407746.sh.run.tcloudbase.com/TreeModel
   - 3D 校园领养分布地图与 3D 树木养护模型
   - 树木/树类信息管理
   - 活动发布与数据看板
   - 用户领养编辑与统计
   - 优化 3D 渲染性能，支持窗口自适应与资源自动清理

   界面截图:
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae1bcd19c4.jpg" width="650" height="300"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae1bd24717.jpg" width="650" height="300"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae1bd4c3b5.jpeg" width="650" height="300"/>
   <img src="https://youke1.picui.cn/s1/2025/08/24/68aae1bd349d8.jpeg" width="650" height="300"/>

3. **后端**

   - 调用阿里云通义大模型，实现树木图像识别与养护建议生成。
   - JWT 双令牌机制（Access Token + Refresh Token），支持权限分级管理。
   - 提供多维度统计数据接口（领养趋势、树种分布等等）。
   - 通过 TypeORM 实现数据库事务控制（如领养流程中的积分扣除与记录更新）。

---

GouziAkuan 敬上
