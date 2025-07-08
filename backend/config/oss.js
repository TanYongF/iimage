const OSS = require('ali-oss');
const dotenv = require('dotenv');
const stream = require('stream');

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
  const extension = originalName.split('.').pop().toLowerCase();
  const fileName = `${timestamp}-${randomString}.${extension}`;
  return {
    ossPath: `${ossConfig.dir}${fileName}`,
    displayName: fileName
  };
};

// 上传文件到 OSS
const uploadToOSS = async (file) => {
  try {
    const { ossPath, displayName } = generateUniqueFileName(file.originalname);
    const result = await ossClient.put(ossPath, file.buffer);
    return {
      url: result.url,
      fileName: displayName
    };
  } catch (error) {
    console.error('OSS upload error:', error);
    throw new Error('文件上传失败');
  }
};

// 获取 OSS 文件的可读流
const getOSSFileStream = async (fileName) => {
  try {
    const ossPath = `${ossConfig.dir}${fileName}`;
    const result = await ossClient.getStream(ossPath);
    return result.stream;
  } catch (error) {
    console.error('OSS get file stream error:', error);
    return null;
  }
};

// 删除 OSS 文件
const deleteOSSFile = async (fileName) => {
  try {
    const ossPath = `${ossConfig.dir}${fileName}`;
    // 先检查文件是否存在
    await ossClient.head(ossPath);
    // 存在则删除
    await ossClient.delete(ossPath);
    return { success: true, notFound: false };
  } catch (error) {
    if (error.name === 'NoSuchKeyError' || error.code === 'NoSuchKey' || error.status === 404) {
      // 文件不存在
      return { success: false, notFound: true };
    }
    console.error('OSS delete file error:', error);
    return { success: false, notFound: false };
  }
};

// 获取 OSS 文件信息
const getOSSFileInfo = async (fileName) => {
  try {
    const ossPath = `${ossConfig.dir}${fileName}`;
    const result = await ossClient.head(ossPath);
    // 修正 URL 拼接
    const endpoint = typeof ossClient.options.endpoint === 'string'
      ? ossClient.options.endpoint.replace(/^https?:\/\//, '')
      : (ossClient.options.endpoint && ossClient.options.endpoint.hostname)
        ? ossClient.options.endpoint.hostname
        : process.env.OSS_ENDPOINT.replace(/^https?:\/\//, '');
    return {
      id: fileName,
      url: `${ossClient.options.secure ? 'https' : 'http'}://${ossClient.options.bucket}.${endpoint}/${ossPath}`,
      size: result.res.headers['content-length'] ? parseInt(result.res.headers['content-length'], 10) : undefined,
      uploadTime: result.res.headers['last-modified']
    };
  } catch (error) {
    console.error('OSS get file info error:', error);
    return null;
  }
};

module.exports = {
  ossClient,
  uploadToOSS,
  getOSSFileStream,
  deleteOSSFile,
  getOSSFileInfo
}; 