# PhotoOmmit

一个轻量级的在线图床服务，支持图片上传、链接复制和 Markdown 格式复制。

## 功能特点

- 支持拖拽、点击或粘贴上传图片
- 支持复制图片链接和 Markdown 格式
- 支持大文件上传（最大 30MB）
- 内置限速保护：
  - 每秒最多上传 5 张图片
  - 每个 IP 每天最多上传 100 张图片
- 支持 Docker 部署
- 支持 GitHub Actions 自动部署

## 技术栈

- 前端：Vue 3 + Element Plus
- 后端：Node.js + Express
- 存储：阿里云 OSS
- 部署：Docker + GitHub Actions

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/你的用户名/photoommit.git
cd photoommit
```

2. 安装依赖：
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

3. 配置环境变量：
```bash
# 在 backend 目录下创建 .env 文件
cp env.example.txt .env
# 编辑 .env 文件，填入你的阿里云 OSS 配置
```

4. 启动开发服务器：
```bash
# 启动前端开发服务器
cd frontend
npm run dev

# 启动后端服务器
cd ../backend
npm run dev
```

## Docker 部署

1. 构建镜像：
```bash
docker-compose build
```

2. 启动服务：
```bash
docker-compose up -d
```

服务将在 http://localhost:8085 上运行。

## 环境变量配置

在 `backend/.env` 文件中配置以下环境变量：

```env
# 服务器配置
PORT=3000

# 阿里云 OSS 配置
OSS_REGION=your-region
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
OSS_BUCKET=your-bucket-name
OSS_ENDPOINT=your-endpoint
```

## 限速配置

在 `backend/server.js` 中可以修改限速配置：

```javascript
const RATE_LIMIT = {
  windowMs: 1000,    // 时间窗口（毫秒）
  max: 5,            // 每秒最大请求数
  dailyLimit: 100    // 每日最大请求数
};
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
