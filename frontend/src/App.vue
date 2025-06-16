<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const uploadedUrl = ref('')
const fileInput = ref(null)
const uploadProgress = ref(0)
const showProgress = ref(false)
const previewImage = ref('')

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
      previewImage.value = data.url
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
  const markdown = `![image](${uploadedUrl.value})`
  navigator.clipboard.writeText(markdown)
  ElMessage.success('Markdown 链接已复制到剪贴板')
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
        <div class="preview-overlay">
          <p>点击图片重新上传</p>
        </div>
      </div>

      <el-progress 
        v-if="showProgress"
        :percentage="uploadProgress"
        :format="() => '上传中...'"
        status="success"
      />

      <div v-if="uploadedUrl" class="result-area">
        <div class="result-row">
          <el-input v-model="uploadedUrl" readonly>
            <template #append>
              <el-button @click="copyUrl">复制链接</el-button>
            </template>
          </el-input>
        </div>
        <div class="result-row">
          <el-input :model-value="`![image](${uploadedUrl})`" readonly>
            <template #append>
              <el-button @click="copyMarkdown">复制 Markdown</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <div class="footer">
      <a href="https://github.com/TanYongF/iimage" target="_blank" class="github-link">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" class="github-icon">
        <span>GitHub</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
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
  padding: 40px;
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
  margin-bottom: 16px;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
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

.result-row {
  margin-bottom: 8px;
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
</style>
