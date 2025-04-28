const axios = require("axios");
const config = require("../config"); // 引入配置文件

const User = require("../models/user");
const { generateToken, sendSubscribeMessage } = require("../utils"); // 引入生成token的函数
class UserController {
  static async login(ctx) {
    const { code, userInfo } = ctx.request.body;

    if (!code) {
      ctx.status = 400;
      ctx.body = { message: "缺少code参数" };
      return;
    }

    // 1. 使用code换取openid和session_key
    const wxRes = await axios.get(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        params: {
          appid: config.appid,
          secret: config.secret,
          js_code: code,
          grant_type: "authorization_code",
        },
      }
    );

    const { openid, session_key, unionid } = wxRes.data;
    console.log("获取到的openid和session_key:", openid, session_key, userInfo);
    if (!openid) {
      ctx.status = 401;
      ctx.body = { message: "获取openid失败", error: wxRes.data };
      return;
    }

    // 示例：发送提醒
    // sendSubscribeMessage(
    //   openid,
    //   "KTWpzp3XwjEZ_JHVEy3Zeu4a0yGX-54JKhje0YKtXiA",
    //   {
    //     thing1: { value: "社区新消息" },
    //     thing2: { value: "您有一条新的回复" },
    //   }
    //   // "pages/notifications/notifications"
    // );

    const user = await User.findOne({ openid });
    if (!user) {
      await this.createUser(ctx, openid, userInfo); // 创建用户
    }

    const token = generateToken(openid, session_key);
    ctx.status = 200;
    ctx.body = {
      code: 200,
      data: {
        token,
        openid,
        userInfo,
      },
    };
  }
  // 创建用户
  static async createUser(ctx, openid, userInfo) {
    try {
      // 创建用户
      const user = new User({ openid, userInfo });
      await user.save();
      console.log("用户创建成功");
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "服务器错误", error: error.message };
    }
  }

  // 获取用户列表
  static async getUsers(ctx) {
    try {
      const { page = 1, limit = 10 } = ctx.query;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .skip(skip)
        .limit(parseInt(limit))
        .select("-password -__v") // 排除敏感字段
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      ctx.body = {
        data: users,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "服务器错误", error: error.message };
    }
  }

  // 获取单个用户
  static async getUser(ctx) {
    try {
      const { id } = ctx.params;
      const user = await User.findById(id).select("-password -__v");

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "用户不存在" };
        return;
      }

      ctx.body = { data: user };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "服务器错误", error: error.message };
    }
  }

  // 更新用户
  static async updateUser(ctx) {
    try {
      const { id } = ctx.params;
      const { phone } = ctx.request.body;

      const user = await User.findByIdAndUpdate(
        id,
        { phone, updatedAt: Date.now() },
        { new: true }
      ).select("-password -__v");

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "用户不存在" };
        return;
      }

      ctx.body = {
        message: "用户更新成功",
        data: user,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "服务器错误", error: error.message };
    }
  }

  // 删除用户
  static async deleteUser(ctx) {
    try {
      const { id } = ctx.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: "用户不存在" };
        return;
      }

      ctx.body = { message: "用户删除成功" };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "服务器错误", error: error.message };
    }
  }
}

module.exports = UserController;
