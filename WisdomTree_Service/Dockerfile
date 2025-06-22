# Step 1: 使用 Node.js 的官方镜像作为基础镜像
FROM node:20-alpine

# Step 2: 设置工作目录
WORKDIR /app

# Step 3: 将 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# Step 4: 安装所有依赖，包括开发依赖
RUN npm install

# Step 5: 复制项目的源代码到容器中
COPY . .

# Step 6: 编译 TypeScript 为 JavaScript
RUN npm run build

# Step 7: 删除开发依赖，减少镜像体积
RUN npm prune --production

# Step 8: 暴露应用的端口
EXPOSE 8080

# Step 9: 启动应用，Nest 会自动加载 .env 文件
CMD ["npm", "run", "start:prod"]
