# PhotoOmmit

**PhotoOmmit** 是一个轻量级在线图床网站，支持粘贴上传图片，自动生成图片直链，适合博客、Markdown 文档、论坛等场景使用。

👉 [立即使用 PhotoOmmit](https://photo.tans.fun)

## ✨ 功能特性

- 📋 粘贴上传：直接 `Ctrl+V` 粘贴图片上传，无需拖拽或选择文件
- 🔗 自动生成外链：上传成功后立即获取图片 URL
- ☁️ 后端存储支持：使用阿里云 OSS 实现高可靠的图片存储
- 🖼️ 支持多种图片格式：如 PNG、JPG、GIF、WebP 等
- 📁 支持批量上传、历史记录（可选）

## 🛠 技术栈

前端：

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/) 或其他组件库（如适用）
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

后端：

- Node.js + Express（或 NestJS 等）
- 阿里云 OSS SDK（`ali-oss`）
- 可选：MongoDB / Redis 用于记录用户上传历史

## 🚀 快速开始

### 在线体验

1. 访问 [https://photo.tans.fun](https://photo.tans.fun)
2. 将图片复制到剪贴板（例如截图工具复制 PNG）
3. 在网站中按 `Ctrl+V` 粘贴
4. 上传成功后即可复制图片直链！

### 本地部署（开发中）

```bash
# 克隆仓库
git clone https://github.com/yourname/photoommit.git
cd photoommit

# 安装依赖
npm install

# 启动开发服务器
npm run dev

```

## 📦 自动化部署

### GitHub Actions

项目使用 GitHub Actions 进行自动化构建和部署：

1. 代码推送触发构建
2. 运行测试
3. 构建 Docker 镜像
4. 推送到 Docker Hub
5. 自动部署到服务器

### 部署流程

1. 推送代码到 main 分支
2. GitHub Actions 自动触发构建
3. 构建成功后自动部署到服务器

## 🔧 开发指南

### 目录结构

```
photoommit/
├── frontend/          # 前端项目
│   ├── src/          # 源代码
│   └── public/       # 静态资源
├── backend/          # 后端项目
│   ├── config/       # 配置文件
│   └── routes/       # 路由文件
└── docker/           # Docker 相关文件
```

### 开发规范

- 使用 ESLint 进行代码规范检查
- 遵循 Git Flow 工作流
- 提交信息遵循 Conventional Commits 规范

## 📝 许可证

MIT License

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request
