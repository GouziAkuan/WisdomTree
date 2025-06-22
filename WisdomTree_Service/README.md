### **后端 README**  

# 后端服务（Nest.js）  

**功能概述**  
后端为系统提供模块化服务，支持 AI 识别、用户认证、数据存储与业务逻辑处理，采用 RESTful API 与前后端分离架构。  

---

**核心模块**  
1. **AI 识别模块**  
   - 调用阿里云通义大模型，实现树木图像识别与养护建议生成。  
2. **用户认证模块**  
   - JWT 双令牌机制（Access Token + Refresh Token），支持权限分级管理。  
3. **数据图表模块**  
   - 提供多维度统计数据接口（领养趋势、树种分布）。  
4. **事务管理**  
   - 通过 TypeORM 实现数据库事务控制（如领养流程中的积分扣除与记录更新）。  

---

**技术实现**  
- **框架**：Nest.js（模块化设计 + 依赖注入）  
- **数据库**：MySQL 8.0（InnoDB 引擎）  
- **工具**：TypeORM（ORM 映射）、Jest（单元测试）  

---

**运行与部署**  
1. **环境依赖**  
   - Node.js 20+、MySQL 8.0  
2. **配置文件**  
   ```env
   # .env.example
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=green_school
3. **启动**
   导入SQL文件
  - npm run install
  - npm run start