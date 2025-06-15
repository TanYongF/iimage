const OSS = require('ali-oss');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// OSS 客户端配置
const ossConfig = {
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  endpoint: process.env.OSS_ENDPOINT,
  secure: true,
  timeout: 60000,
  dir: 'PhotoOmmit/'
};

// 创建 OSS 客户端实例
const ossClient = new OSS(ossConfig);

// 生成唯一的文件名
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${ossConfig.dir}${timestamp}-${randomString}.${extension}`;
};

// 上传文件到 OSS
const uploadToOSS = async (file) => {
  try {
    const fileName = generateUniqueFileName(file.originalname);
    const result = await ossClient.put(fileName, file.buffer);
    return result.url;
  } catch (error) {
    console.error('OSS upload error:', error);
    throw new Error('文件上传失败');
  }
};

module.exports = {
  ossClient,
  uploadToOSS
}; 