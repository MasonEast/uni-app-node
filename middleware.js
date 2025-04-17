const jwt = require("jsonwebtoken");
const config = require("./config/config"); // 引入配置文件
// 中间件：验证JWT

const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    ctx.status = 401;
    ctx.body = { code: 401, message: "未提供token" };
    return;
  }

  // 检查是否已注销
  if (revokedTokens.has(token)) {
    ctx.status = 401;
    ctx.body = { code: 401, message: "token已失效" };
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { code: 401, message: "无效的token" };
  }
};

module.exports = {
  authMiddleware,
};
