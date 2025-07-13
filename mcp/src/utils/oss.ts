import OSS from 'ali-oss';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const defaultConfig = {
  region: 'ocn-shanghai',
  accessKeyId: 'unknown',
  accessKeySecret: 'unknown',
  bucket: 'unknown',
  endpoint: 'oss-accelerate.aliyuncs.com',
  secure: true,
  timeout: 60000,
  dir: 'PhotoOmmit/'
};

// OSS 客户端配置
const ossConfig = {
  ...defaultConfig,
  region: process.env.OSS_REGION || defaultConfig.region,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || defaultConfig.accessKeyId,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || defaultConfig.accessKeySecret,
  bucket: process.env.OSS_BUCKET || defaultConfig.bucket,
  endpoint: process.env.OSS_ENDPOINT || defaultConfig.endpoint,
};

// 创建 OSS 客户端实例
const ossClient = new OSS(ossConfig);

// 生成唯一的文件名
const generateUniqueFileName = (originalName: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const safeExtension = extension ? extension.toLowerCase() : '';
  const fileName = safeExtension ? `${timestamp}-${randomString}.${safeExtension}` : `${timestamp}-${randomString}`;
  return {
    ossPath: `${ossConfig.dir}${fileName}`,
    displayName: fileName
  };
};

// 上传文件到 OSS
const uploadToOSS = async (file: { originalname: string; buffer: Buffer }) => {
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
const getOSSFileStream = async (fileName: string) => {
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
const deleteOSSFile = async (fileName: string) => {
  try {
    const ossPath = `${ossConfig.dir}${fileName}`;
    // 先检查文件是否存在
    await ossClient.head(ossPath);
    // 存在则删除
    await ossClient.delete(ossPath);
    return { success: true, notFound: false };
  } catch (error: any) {
    if (
      (error && typeof error === 'object' && (
        (error as any).name === 'NoSuchKeyError' ||
        (error as any).code === 'NoSuchKey' ||
        (error as any).status === 404
      ))
    ) {
      // 文件不存在
      return { success: false, notFound: true };
    }
    console.error('OSS delete file error:', error);
    return { success: false, notFound: false };
  }
};

// 获取 OSS 文件信息
const getOSSFileInfo = async (fileName: string) => {
  try {
    const ossPath = `${ossConfig.dir}${fileName}`;
    const result = await ossClient.head(ossPath);
    // 用初始化时的 ossConfig 获取 endpoint、bucket、secure
    const endpoint =
      typeof ossConfig.endpoint === 'string'
        ? ossConfig.endpoint.replace(/^https?:\/\//, '')
        : '';
    const headers = result.res.headers as Record<string, string>;
    return {
      id: fileName,
      url: `${ossConfig.secure ? 'https' : 'http'}://${ossConfig.bucket}.${endpoint}/${ossPath}`,
      size: headers['content-length'] ? parseInt(headers['content-length'], 10) + 'B' : undefined,
      uploadTime: headers['last-modified']
    };
  } catch (error) {
    console.error('OSS get file info error:', error);
    return null;
  }
};

export default {
  ossClient,
  uploadToOSS,
  getOSSFileStream,
  deleteOSSFile,
  getOSSFileInfo
}; 