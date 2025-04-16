const Router = require("koa-router");
const axios = require("axios");
const router = new Router();

// 微信小程序配置
const wxConfig = {
  appId: "wx64e3f8818fd4ab9c",
  appSecret: "12909862180c39e485497a54820e9f80",
};

router.post("/api/wx-login", async (ctx) => {
  console.log(ctx.request.body, "[[[[[[[[[");
  const { code } = ctx.request.body;

  if (!code) {
    ctx.status = 400;
    ctx.body = { message: "缺少code参数" };
    return;
  }

  try {
    // 1. 使用code换取openid和session_key
    const wxRes = await axios.get(
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
    console.log(wxRes.data, "wxRes.data");
    const { openid, session_key, unionid } = wxRes.data;

    if (!openid) {
      ctx.status = 401;
      ctx.body = { message: "获取openid失败", error: wxRes.data };
      return;
    }

    // 2. 这里可以查询数据库，看用户是否已存在
    // 如果是新用户，创建用户记录
    // 如果是老用户，更新登录信息

    // 3. 生成自定义登录态（token）
    const token = generateToken(openid); // 实现你自己的token生成逻辑

    // 4. 返回token和用户信息给小程序
    ctx.body = {
      token,
      userInfo: {
        openid,
        // 其他用户信息...
      },
    };
  } catch (error) {
    console.error("微信登录错误:", error);
    ctx.status = 500;
    ctx.body = { message: "登录失败", error: error.message };
  }
});

// 更新用户信息接口
router.post("/api/update-user-info", async (ctx) => {
  const { userInfo } = ctx.request.body;
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

function generateToken(openid) {
  // 实现你的token生成逻辑，可以使用jwt等
  // 例如: return jwt.sign({ openid }, 'your-secret-key', { expiresIn: '7d' });
  return "your-generated-token";
}

module.exports = router;
