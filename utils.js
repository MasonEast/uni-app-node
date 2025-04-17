const crypto = require("crypto");

function generateToken(userId, openid) {
  // 这里可以使用jwt等生成token
  // 示例使用简单实现
  const token = crypto
    .createHash("sha256")
    .update(userId + openid + Date.now() + "your-secret-key")
    .digest("hex");

  return token;
}

module.exports = {
  generateToken,
};
