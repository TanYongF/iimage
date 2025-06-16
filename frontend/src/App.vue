<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const uploadedUrl = ref('')
const fileInput = ref(null)

const triggerFileInput = () => {
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
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    if (data.url) {
      uploadedUrl.value = data.url
      ElMessage.success('上传成功！')
    }
  } catch (error) {
    ElMessage.error('上传失败，请重试')
    console.error('Upload error:', error)
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
      
      <div class="upload-area" 
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

      <div v-if="uploadedUrl" class="result-area">
        <el-input v-model="uploadedUrl" readonly>
          <template #append>
            <el-button @click="copyUrl">复制链接</el-button>
            <el-button @click="copyMarkdown">复制 Markdown</el-button>
          </template>
        </el-input>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.upload-card {
  border-radius: 8px;
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

.result-area {
  margin-top: 20px;
}
</style>
