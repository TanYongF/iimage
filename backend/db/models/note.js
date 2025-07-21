const db = require('../index');

// 获取 note
async function getNote(key) {
  const [rows] = await db.execute('SELECT `key`, `value`, `url`, `createdTime`, `updatedTime` FROM note WHERE `key`=?', [key]);
  return rows[0];
}

// 新增/更新 note
async function setNote(key, value, url = null) {
  const [result] = await db.execute(
    'INSERT INTO note (`key`, `value`, `url`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value`=?, `url`=?, updatedTime=NOW()',
    [key, value, url, value, url]
  );
  return result.affectedRows > 0;
}

// 获取所有 note
async function getAllNotes() {
  const [rows] = await db.execute('SELECT `key`, `value`, `url`, `createdTime`, `updatedTime` FROM note');
  return rows;
}

module.exports = {
  getNote,
  setNote,
  getAllNotes
};