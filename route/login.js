const Router = require("koa-router");
const axios = require("axios");
const crypto = require("crypto");
const router = new Router();

const config = require("../config/config"); // 引入配置文件
const { authMiddleware } = require("../middleware"); // 引入中间件

const UserController = require("../controllers/UserController");
const User = require("../models/user"); // 引入用户模型

router.post("/api/wx-login", async (ctx) => {
  console.log(ctx.request.body, "-------------cccccccccccccccc");

  await UserController.login(ctx); // 创建用户
});

router.post("/api/update-user-info", async (ctx) => {
  const { userInfo } = ctx.request.body;
  console.log(ctx.request.body, "-------------cccccccccccccccc");
  const token = ctx.headers.authorization?.split(" ")[1];

  if (!token) {
    ctx.status = 401;
    return;
  }

  try {
    // 验证token并获取用户openid
    const decoded = verifyToken(token); // 实现你的token验证逻辑
    const openid = decoded.openid;

    // 更新数据库中的用户信息
    // 这里假设你有一个User模型
    const updatedUser = await User.findOneAndUpdate(
      { openid },
      {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        country: userInfo.country,
        province: userInfo.province,
        city: userInfo.city,
      },
      { new: true }
    );

    ctx.body = { success: true, user: updatedUser };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "更新用户信息失败", error: error.message };
  }
});

// 手机号登录接口
router.post("/api/phone-login", async (ctx) => {
  const { code, encryptedData, iv } = ctx.request.body;
  console.log(ctx.request.body, "-------------");

  if (!code || !encryptedData || !iv) {
    ctx.status = 400;
    ctx.body = { message: "缺少必要参数" };
    return;
  }

  try {
    // 1. 获取session_key
    const sessionRes = await axios.get(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        params: {
          appid: wxConfig.appId,
          secret: wxConfig.appSecret,
          js_code: code,
          grant_type: "authorization_code",
        },
      }
    );
    console.log(sessionRes.data);

    const { session_key, openid } = sessionRes.data;

    if (!session_key || !openid) {
      ctx.status = 401;
      ctx.body = { message: "获取session_key失败", error: sessionRes.data };
      return;
    }

    // 2. 解密手机号
    const decryptedData = decryptPhoneNumber(
      encryptedData,
      iv,
      session_key,
      wxConfig.appId
    );
    const phoneNumber = decryptedData.phoneNumber;
    console.log(phoneNumber, "------------------");
    // 3. 查询或创建用户
    let user = await UserController.getUser({ phoneNumber });

    if (!user) {
      // 新用户注册
      user = new User({
        openid,
        phoneNumber,
        registerTime: new Date(),
        lastLoginTime: new Date(),
      });
      await user.save();
    } else {
      // 老用户更新登录信息
      user.lastLoginTime = new Date();
      await user.save();
    }

    // 4. 生成登录token
    const token = generateToken(user._id, openid);

    // 5. 返回登录结果
    ctx.body = {
      token,
      userInfo: {
        phoneNumber: user.phoneNumber,
        openid: user.openid,
        // 其他用户信息...
      },
    };
  } catch (error) {
    console.error("手机号登录错误:", error);
    ctx.status = 500;
    ctx.body = { message: "手机号登录失败", error: error.message };
  }
});

// 解密手机号函数
function decryptPhoneNumber(encryptedData, iv, sessionKey, appId) {
  // base64解码
  sessionKey = Buffer.from(sessionKey, "base64");
  encryptedData = Buffer.from(encryptedData, "base64");
  iv = Buffer.from(iv, "base64");

  try {
    // 解密
    const decipher = crypto.createDecipheriv("aes-128-cbc", sessionKey, iv);
    decipher.setAutoPadding(true);
    let decoded = decipher.update(encryptedData, "binary", "utf8");
    decoded += decipher.final("utf8");

    decoded = JSON.parse(decoded);

    // 校验appId
    if (decoded.watermark.appid !== appId) {
      throw new Error("Illegal Buffer");
    }

    return decoded;
  } catch (error) {
    throw new Error("解密失败: " + error.message);
  }
}

// 生成token函数
function generateToken(userId, openid) {
  // 这里可以使用jwt等生成token
  // 示例使用简单实现
  const token = crypto
    .createHash("sha256")
    .update(userId + openid + Date.now() + "your-secret-key")
    .digest("hex");

  return token;
}

module.exports = router;
