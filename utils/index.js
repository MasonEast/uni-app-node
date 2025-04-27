const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const config = require("../config");

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

const cache = { accessToken: "", expireTime: 0 };

async function getAccessToken() {
  const now = Date.now();

  // 如果缓存未过期，直接返回
  if (cache.accessToken && now < cache.expireTime) {
    return cache.accessToken;
  }

  // 否则重新获取
  const appId = config.appid;
  const appSecret = config.secret;
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

  try {
    const response = await axios.get(url);
    if (response.data.access_token) {
      // 缓存 access_token，提前 5 分钟（300000ms）刷新
      cache.accessToken = response.data.access_token;
      cache.expireTime = now + (response.data.expires_in - 300) * 1000;
      return cache.accessToken;
    } else {
      throw new Error("获取access_token失败: " + JSON.stringify(response.data));
    }
  } catch (error) {
    throw new Error("获取access_token异常: " + error.message);
  }
}

async function sendSubscribeMessage(openid, templateId, data, page) {
  const accessToken = await getAccessToken(); // 获取小程序access_token

  const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;

  const result = await axios.post(url, {
    touser: openid,
    template_id: templateId,
    page: page || "pages/index/index", // 点击消息跳转的页面
    data: data, // 模板内容
  });

  return result.data;
}

// 获取本机IP地址
function getIPAddress() {
  const interfaces = require("os").networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
  return "localhost";
}

module.exports = {
  generateToken,
  verifyToken,
  getAccessToken,
  sendSubscribeMessage,
  getIPAddress,
};
