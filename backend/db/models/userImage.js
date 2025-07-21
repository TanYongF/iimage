const db = require('../index');

// 新增图片
async function addUserImage(data) {
  const [result] = await db.execute(
    `INSERT INTO user_images (user_id, created_time, updated_time, image_url, image_info, image_size, image_hash, view_count, like_count, is_public, storage_provider, is_deleted, tag_id, remark, image_type)
     VALUES (?, NOW(), NOW(), ?, ?, ?, ?, 0, 0, ?, ?, 0, ?, ?, ?)`,
    [
      data.user_id,
      data.image_url,
      data.image_info,
      data.image_size,
      data.image_hash,
      data.is_public,
      data.storage_provider,
      data.tag_id,
      data.remark,
      data.image_type
    ]
  );
  return result.insertId;
}

// 查询图片（可按用户、公开、标签等筛选）
async function getUserImages({ user_id, is_public, tag_id, limit = 20, offset = 0 }) {
  let sql = 'SELECT * FROM user_images WHERE is_deleted=0';
  const params = [];
  if (user_id) {
    sql += ' AND user_id=?';
    params.push(user_id);
  }
  if (typeof is_public === 'number') {
    sql += ' AND is_public=?';
    params.push(is_public);
  }
  if (tag_id) {
    sql += ' AND tag_id=?';
    params.push(tag_id);
  }
  sql += ' ORDER BY created_time DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await db.execute(sql, params);
  return rows;
}

// 根据ID获取图片
async function getUserImageById(id) {
  const [rows] = await db.execute('SELECT * FROM user_images WHERE id=? AND is_deleted=0', [id]);
  return rows[0];
}

// 更新图片信息
async function updateUserImage(id, data) {
  const fields = [];
  const params = [];
  for (const key of ['image_info', 'tag_id', 'remark', 'is_public', 'image_type']) {
    if (data[key] !== undefined) {
      fields.push(`${key}=?`);
      params.push(data[key]);
    }
  }
  if (fields.length === 0) return false;
  params.push(id);
  const [result] = await db.execute(
    `UPDATE user_images SET ${fields.join(', ')}, updated_time=NOW() WHERE id=? AND is_deleted=0`,
    params
  );
  return result.affectedRows > 0;
}

// 软删除图片
async function deleteUserImage(id) {
  const [result] = await db.execute('UPDATE user_images SET is_deleted=1, updated_time=NOW() WHERE id=?', [id]);
  return result.affectedRows > 0;
}

// 统计所有图片数量（不含已删除）
async function countAllImages() {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM user_images WHERE is_deleted=0');
  return rows[0]?.count || 0;
}

// 按用户统计图片数量
async function countImagesByUser(user_id) {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM user_images WHERE user_id=? AND is_deleted=0', [user_id]);
  return rows[0]?.count || 0;
}

// 按标签统计图片数量
async function countImagesByTag(tag_id) {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM user_images WHERE tag_id=? AND is_deleted=0', [tag_id]);
  return rows[0]?.count || 0;
}

// 统计公开图片数量
async function countPublicImages() {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM user_images WHERE is_public=1 AND is_deleted=0');
  return rows[0]?.count || 0;
}

// 通过图片hash全局查找图片
async function getImageByHash(image_hash) {
  const [rows] = await db.execute('SELECT * FROM user_images WHERE image_hash=? AND is_deleted=0 LIMIT 1', [image_hash]);
  return rows[0];
}

// 通过用户ID和图片hash查找图片
async function getUserImageByUserIdAndHash(user_id, image_hash) {
  const [rows] = await db.execute('SELECT * FROM user_images WHERE user_id=? AND image_hash=? AND is_deleted=0 LIMIT 1', [user_id, image_hash]);
  return rows[0];
}

module.exports = {
  addUserImage,
  getUserImages,
  getUserImageById,
  updateUserImage,
  deleteUserImage,
  countAllImages,
  countImagesByUser,
  countImagesByTag,
  countPublicImages,
  getImageByHash,
  getUserImageByUserIdAndHash
}; 