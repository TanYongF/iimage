#!/bin/bash

# 设置错误时退出
set -e

echo "🚀 开始本地部署..."

# 1. 构建前端
echo "📦 构建前端..."
cd frontend
npm install
npm run build

# 2. 构建后端
echo "🔧 构建后端..."
cd ../backend
npm install

# 3. 复制前端构建产物到后端目录
echo "📋 复制前端构建产物..."
rm -rf public
mkdir -p public
cp -r ../frontend/dist/* public/

# 4. 检查环境变量
echo "🔍 检查环境变量..."
if [ ! -f .env ]; then
    echo "⚠️  警告: .env 文件不存在，请确保已配置以下环境变量："
    echo "   - PORT"
    echo "   - OSS_REGION"
    echo "   - OSS_ACCESS_KEY_ID"
    echo "   - OSS_ACCESS_KEY_SECRET"
    echo "   - OSS_BUCKET"
    echo "   - OSS_ENDPOINT"
    exit 1
fi

# 5. 启动服务
echo "🚀 启动服务..."
node server.js 