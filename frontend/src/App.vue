<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const uploadedUrl = ref('')
const fileInput = ref(null)
const uploadProgress = ref(0)
const showProgress = ref(false)
const previewImage = ref('')
const imageInfo = ref(null)
const markdownUrl = ref('')
const htmlUrl = ref('')

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const triggerFileInput = () => {
  if (uploadedUrl.value) {
    // 如果已有图片，清空并重新上传
    uploadedUrl.value = ''
    previewImage.value = ''
  }
  fileInput.value.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    // 使用本地文件路径预览
    previewImage.value = URL.createObjectURL(file)
    imageInfo.value = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type
    }
    await uploadFile(file)
  }
}

const handlePaste = async (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      await uploadFile(file)
      break
    }
  }
}

const handleDrop = async (event) => {
  const files = event.dataTransfer.files
  if (files.length > 0) {
    await uploadFile(files[0])
  }
}

const uploadFile = async (file) => {
  try {
    showProgress.value = true
    uploadProgress.value = 0
    
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '上传失败')
    }
    
    const data = await response.json()
    if (data.url) {
      uploadedUrl.value = data.url
      // 更新 Markdown 和 HTML 链接
      markdownUrl.value = `![${imageInfo.value.name}](${data.url})`
      htmlUrl.value = `<img src="${data.url}" alt="${imageInfo.value.name}">`
      // 保持使用本地预览，不更新 previewImage
      ElMessage.success('上传成功！')
    }
  } catch (error) {
    ElMessage.error(error.message || '上传失败，请重试')
    console.error('Upload error:', error)
  } finally {
    showProgress.value = false
    uploadProgress.value = 0
  }
}

const copyUrl = () => {
  navigator.clipboard.writeText(uploadedUrl.value)
  ElMessage.success('链接已复制到剪贴板')
}

const copyMarkdown = () => {
  const fileName = imageInfo.value?.name || 'image'
  const markdown = `![${fileName}](${uploadedUrl.value})`
  navigator.clipboard.writeText(markdown)
  ElMessage.success('Markdown 链接已复制到剪贴板')
}

const copyHtml = () => {
  const html = `<img src="${uploadedUrl.value}" alt="image">`
  navigator.clipboard.writeText(html)
  ElMessage.success('HTML 链接已复制到剪贴板')
}
</script>

<template>
  <div class="container">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <h2>PhotoOmmit</h2>
          <p>轻量级在线图床</p>
        </div>
      </template>
      
      <div v-if="!previewImage" 
           class="upload-area" 
           @paste="handlePaste"
           @dragover.prevent
           @drop.prevent="handleDrop"
           @click="triggerFileInput">
        <el-icon class="upload-icon"><Upload /></el-icon>
        <p>点击、拖拽图片到此处，或按 Ctrl+V 粘贴图片</p>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept="image/*"
          @change="handleFileSelect"
        >
      </div>

      <div v-else class="preview-area">
        <img :src="previewImage" class="preview-image" @click="triggerFileInput" />
        <div class="preview-overlay" @click="triggerFileInput">
          <div class="image-info">
            <p>点击图片重新上传</p>
            <div v-if="imageInfo" class="info-details">
              <p>文件名：{{ imageInfo.name }}</p>
              <p>大小：{{ imageInfo.size }}</p>
              <p>类型：{{ imageInfo.type }}</p>
            </div>
          </div>
        </div>
      </div>

      <el-progress 
        v-if="showProgress"
        :percentage="uploadProgress"
        :format="() => '上传中...'"
        status="success"
      />

      <div v-if="uploadedUrl" class="result-area">
        <el-input
          v-model="uploadedUrl"
          readonly
          class="result-input"
        >
          <template #append>
            <el-button class="copy-url-btn" @click="copyUrl">复制链接</el-button>
          </template>
        </el-input>

        <el-input
          v-model="markdownUrl"
          readonly
          class="result-input"
        >
          <template #append>
            <el-button class="copy-markdown-btn" @click="copyMarkdown">复制 Markdown</el-button>
          </template>
        </el-input>

        <el-input
          v-model="htmlUrl"
          readonly
          class="result-input"
        >
          <template #append>
            <el-button class="copy-html-btn" @click="copyHtml">复制 HTML</el-button>
          </template>
        </el-input>
      </div>
    </el-card>

    <div class="footer">
      <a href="https://github.com/TanYongF/iimage" target="_blank" class="github-link">
        <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 16px;
  box-sizing: border-box;
}

.upload-card {
  margin: auto;
  width: 100%;
  max-height: calc(100vh - 100px);
  overflow: auto;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #409EFF;
}

.card-header p {
  margin: 8px 0 0;
  color: #909399;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409EFF;
}

.upload-icon {
  font-size: 48px;
  color: #909399;
  margin-bottom: 13px;
}

.preview-area {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f5f7fa;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-info {
  color: white;
  text-align: center;
}

.info-details {
  margin-top: 16px;
  font-size: 14px;
  opacity: 0.9;
}

.info-details p {
  margin: 4px 0;
}

.preview-overlay p {
  color: white;
  margin: 0;
}

.preview-area:hover .preview-overlay {
  opacity: 1;
}

.result-area {
  margin-top: 10px;
}

.result-input {
  margin-bottom: 8px;
}

.result-input:last-child {
  margin-bottom: 0;
}

.footer {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

.github-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.github-link:hover {
  color: #409EFF;
}

.github-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 8px;
  }
  
  .upload-area {
    padding: 16px;
  }
  
  .preview-area {
    height: 200px;
  }
  
  .result-row {
    margin-bottom: 12px;
  }
  
  .el-input {
    font-size: 14px;
  }
  
  .el-button {
    padding: 8px 12px;
  }
}

.copy-html-btn {
  background: linear-gradient(135deg, #E6A23C, #f0c78a) !important;
  color: #fff !important;
}

.copy-html-btn:hover {
  background: linear-gradient(135deg, #f0c78a, #E6A23C) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.2);
}
</style>
