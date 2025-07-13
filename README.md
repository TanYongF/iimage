# PhotoOmmit

[![npm](https://img.shields.io/npm/v/@tans-dev/photoommit-mcp?color=orange&label=npm)](https://www.npmjs.com/package/@tans-dev/photoommit-mcp) ![Express](https://img.shields.io/badge/Express-4%2B-000000?logo=express&logoColor=white) ![OSS](https://img.shields.io/badge/OSS-Alibaba-1e90ff?logo=alibabacloud&logoColor=white) ![MIT License](https://img.shields.io/badge/license-MIT-ff9800) [![CI/CD Pipeline](https://github.com/TanYongF/iimage/actions/workflows/mcp-build-and-publish.yml/badge.svg)](https://github.com/TanYongF/iimage/actions/workflows/mcp-build-and-publish.yml) [![CI/CD Pipeline](https://github.com/TanYongF/iimage/actions/workflows/web-build-and-publish.yml/badge.svg)](https://github.com/TanYongF/iimage/actions/workflows/web-build-and-publish.yml)


🖼️ 轻量级在线图床，支持图片上传、链接和 Markdown 复制。可通过网页或 MCP 客户端一键使用。

👉 [🌐 在线一键体验 PhotoOmmit](https://paste.tans.fun/)  （无需本地部署，立即试用！）



## ✨ 功能亮点

- 拖拽、点击或粘贴上传图片
- 一键复制图片链接和 Markdown
- 支持大文件（最大 30MB）
- Web 页面和 MCP 客户端均可用
- 云存储：阿里云 OSS
- 支持 Docker 部署 & GitHub Actions 自动化


## 🚀 MCP 一键集成（推荐）

PhotoOmmit 支持 [MCP 协议](https://github.com/modelcontextprotocol/spec)，可直接集成到 Cursor、AI 工具链等平台。

> **无需本地安装，无需环境变量，只需配置即可用。当前仅支持阿里云 OSS。**

### Cursor/AI 工具链配置示例

```jsonc
{
  "mcpServers": {
    "photoommit": {
      "command": "npx",
      "args": ["@tans-dev/photoommit-mcp@latest"],
      "env": {
        // OSS 区域，如 oss-cn-shanghai
        "OSS_REGION": "your-region",
        // AccessKey ID
        "OSS_ACCESS_KEY_ID": "your-access-key-id",
        // AccessKey Secret
        "OSS_ACCESS_KEY_SECRET": "your-access-key-secret",
        // 存储桶名称
        "OSS_BUCKET": "your-bucket-name",
        // Endpoint，推荐加速域名
        "OSS_ENDPOINT": "your-endpoint"
      }
    }
  }
}
```

### 可用工具一览

| 工具名称            | 功能描述                     | 主要参数                      |
|---------------------|------------------------------|-------------------------------|
| image-upload-oss    | 上传本地文件到 OSS 云存储    | filePath（必填），fileName（可选） |
| image-download-oss  | 根据 OSS 文件唯一 ID 下载文件 | id（必填）                    |
| image-delete-oss    | 根据 OSS 文件唯一 ID 删除云端文件 | id（必填）                |
| image-info-oss      | 查询 OSS 文件详细信息         | id（必填）                    |

---

## 🖥️ Web 本地开发

1. 克隆仓库
   ```bash
   git clone https://github.com/你的用户名/photoommit.git
   cd photoommit
   ```
2. 安装依赖
   ```bash
   # 前端
   cd frontend && npm install
   # 后端
   cd ../backend && npm install
   ```
3. 配置环境变量
   ```bash
   # backend 目录下创建 .env
   cp env.example.txt .env
   # 编辑 .env，填写 OSS 配置
   ```
4. 启动服务
   ```bash
   # 前端
   cd frontend && npm run dev
   # 后端
   cd ../backend && npm run dev
   ```

---

## 🐳 Docker 部署

1. 构建镜像
   ```bash
   docker-compose build
   ```
2. 启动服务
   ```bash
   docker-compose up -d
   ```
   服务默认运行在 http://localhost:8085


---

## 🤝 贡献
1. Fork 本仓库
2. 创建分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'feat: xxx'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 发起 Pull Request

---

## 📄 许可证
MIT License - 详见 [LICENSE](LICENSE)
