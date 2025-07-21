const db = require('../index');

// 获取系统信息
async function getSystemInfo(key) {
  const [rows] = await db.execute('SELECT value FROM system_info WHERE `key`=?', [key]);
  return rows[0]?.value;
}

// 设置/更新系统信息
async function setSystemInfo(key, value) {
  const [result] = await db.execute(
    'INSERT INTO system_info (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?',
    [key, value, value]
  );
  return result.affectedRows > 0;
}

// 获取所有系统信息
async function getAllSystemInfo() {
  const [rows] = await db.execute('SELECT `key`, `value` FROM system_info');
  return rows;
}

module.exports = {
  getSystemInfo,
  setSystemInfo,
  getAllSystemInfo
}; 