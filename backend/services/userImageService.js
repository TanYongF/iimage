const userImageModel = require('../db/models/userImage');
const crypto = require('crypto');

// 统一处理查重、复用、上传OSS、插入新记录
async function uploadImageWithOss({ userId, file, isPublic = 1, storageProvider = 'oss', tagId = null, remark = null, uploadToOSS }) {
  const imageHash = crypto.createHash('md5').update(file.buffer).digest('hex');
  // 查全局 hash
  const exist = await userImageModel.getImageByHash(imageHash);
  if (exist) {
    // 查当前用户是否已上传
    const userExist = await userImageModel.getUserImageByUserIdAndHash(userId, imageHash);
    if (userExist) {
      return {
        id: userExist.id,
        url: userExist.image_url,
        fileName: exist.image_url.split('/').pop(),
        duplicate: true
      };
    }
    // 复用已存在图片数据，插入新记录
    const imageData = {
      user_id: userId,
      image_url: exist.image_url,
      image_info: exist.image_info,
      image_size: exist.image_size,
      image_hash: exist.image_hash,
      is_public: isPublic,
      storage_provider: exist.storage_provider || storageProvider,
      tag_id: tagId,
      remark: remark,
      image_type: exist.image_type
    };
    const id = await userImageModel.addUserImage(imageData);
    return {
      id,
      url: exist.image_url,
      fileName: exist.image_url.split('/').pop(),
      duplicate: true
    };
  }
  // 没有则上传
  const result = await uploadToOSS(file);
  const imageType = file.mimetype.split('/')[1] || null;
  const imageData = {
    user_id: userId,
    image_url: result.url,
    image_info: null,
    image_size: file.size,
    image_hash: imageHash,
    is_public: isPublic,
    storage_provider: storageProvider,
    tag_id: tagId,
    remark,
    image_type: imageType
  };
  const id = await userImageModel.addUserImage(imageData);
  return {
    id,
    url: result.url,
    fileName: result.fileName,
    duplicate: false
  };
}

// 上传图片并持久化到数据库
async function uploadImage({ userId, file, isPublic = 1, storageProvider = 'oss', tagId = null, remark = null, existImage = null }) {
  // 统一计算 hash
  const imageHash = existImage
    ? existImage.image_hash
    : crypto.createHash('md5').update(file.buffer).digest('hex');
  // 先查当前用户是否已上传过该 hash
  const userExist = await userImageModel.getUserImageByUserIdAndHash(userId, imageHash);
  if (userExist) {
    return { id: userExist.id, url: userExist.image_url, duplicate: true };
  }
  // 构造数据
  const imageType = existImage
    ? existImage.image_type
    : (file.mimetype.split('/')[1] || null);
  const imageData = existImage
    ? {
        user_id: userId,
        image_url: existImage.image_url,
        image_info: existImage.image_info,
        image_size: existImage.image_size,
        image_hash: existImage.image_hash,
        is_public: isPublic,
        storage_provider: existImage.storage_provider,
        tag_id: tagId,
        remark: remark,
        image_type: existImage.image_type
      }
    : {
        user_id: userId,
        image_url: file.url,
        image_info: null,
        image_size: file.size,
        image_hash: imageHash,
        is_public: isPublic,
        storage_provider: storageProvider,
        tag_id: tagId,
        remark: remark,
        image_type: imageType
      };
  const id = await userImageModel.addUserImage(imageData);
  return { id, url: imageData.image_url, duplicate: !!existImage };
}

// 查找全局 hash 是否存在
async function findImageByHash(hash) {
  return await userImageModel.getImageByHash(hash);
}

// 统计相关
async function countAllImages() {
  return await userImageModel.countAllImages();
}
async function countImagesByUser(userId) {
  return await userImageModel.countImagesByUser(userId);
}
async function countImagesByTag(tagId) {
  return await userImageModel.countImagesByTag(tagId);
}
async function countPublicImages() {
  return await userImageModel.countPublicImages();
}

module.exports = {
  uploadImageWithOss,
  uploadImage,
  findImageByHash,
  countAllImages,
  countImagesByUser,
  countImagesByTag,
  countPublicImages
}; 