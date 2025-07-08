# 构建前端
FROM node:18 AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 构建后端
FROM node:18 AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# 最终镜像
FROM node:18-slim
WORKDIR /app

# 复制前端构建产物
COPY --from=frontend-builder /app/dist /app/frontend/dist

# 复制后端所有文件（包括 middlewares、routes、utils 等）
COPY --from=backend-builder /app /app/backend

# 设置工作目录为后端目录
WORKDIR /app/backend

# 暴露端口
EXPOSE 3000

# 启动后端服务
CMD ["node", "server.js"] 