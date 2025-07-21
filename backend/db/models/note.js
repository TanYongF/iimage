const db = require('../index');

// 获取 note
async function getNote(key) {
  const [rows] = await db.execute('SELECT value FROM note WHERE `key`=?', [key]);
  return rows[0]?.value;
}

// 新增/更新 note
async function setNote(key, value) {
  const [result] = await db.execute(
    'INSERT INTO note (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?, updatedTime=NOW()',
    [key, value, value]
  );
  return result.affectedRows > 0;
}

// 获取所有 note
async function getAllNotes() {
  const [rows] = await db.execute('SELECT `key`, `value`, `createdTime`, `updatedTime` FROM note');
  return rows;
}

module.exports = {
  getNote,
  setNote,
  getAllNotes
};