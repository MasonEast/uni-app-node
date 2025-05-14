const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user");

module.exports = async (ctx, next) => {
  // 从header中获取token
  const token = ctx.header.authorization?.replace("Bearer ", "");

  if (!token) {
    ctx.throw(401, "未提供认证令牌");
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, config.jwtSecret);
    // 查找用户
    const user = await User.findOne({ openid: decoded.openid });

    if (!user) {
      ctx.throw(401, "用户不存在");
    }
    // 将用户信息挂载到ctx.state
    ctx.state.user = user;

    await next();
  } catch (err) {
    ctx.throw(401, "无效的认证令牌");
  }
};
