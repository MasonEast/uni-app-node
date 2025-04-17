const User = require("../models/user");

class UserController {
  // 创建用户
  static async createUser(ctx) {
    try {
      const { username, password, email } = ctx.request.body;

      // 验证输入
      if (!username || !password || !email) {
        ctx.status = 400;
        ctx.body = { message: "缺少必要参数" };
        return;
      }

      // 检查用户是否已存在
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        ctx.status = 409;
        ctx.body = { message: "用户名或邮箱已存在" };
        return;
      }

      // 创建用户
      const user = new User({ username, password, email });
      await user.save();

      ctx.status = 201;
      ctx.body = {
        message: "用户创建成功",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
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
