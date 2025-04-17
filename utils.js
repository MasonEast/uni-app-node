const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("./config/config");

function generateToken(openid, session_key) {
  const token = jwt.sign({ openid, session_key }, config.jwtSecret, {
    expiresIn: config.expiresIn,
  });
  return token;
}

function verifyToken(token, openid) {
  // 使用相同的密钥
  const secretKey = "your-secret-key";

  // 检查最近一段时间内(比如5分钟内)可能生成的token
  const timeWindow = 5 * 60 * 1000; // 5分钟的时间窗口
  const currentTime = Date.now();

  // 检查过去5分钟内可能生成的token
  for (let time = currentTime - timeWindow; time <= currentTime; time += 1000) {
    const possibleToken = crypto
      .createHash("sha256")
      .update(openid + time + secretKey)
      .digest("hex");

    if (possibleToken === token) {
      return true; // 验证通过
    }
  }

  return false; // 验证失败
}

module.exports = {
  generateToken,
  verifyToken,
};
