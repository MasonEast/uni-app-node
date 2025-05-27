const Dynamic = require("../models/dynamics");
const User = require("../models/user")
const Message = require('../models/message');

class DynamicController {
  // 创建新帖子
  static async createDynamic(ctx) {
    try {
      const {
        type,
        title,
        content,
        location,
        datetimerange,
        weixin,
        phone,
        images,
      } = ctx.request.body;

      // 从认证中间件获取用户信息
      const user = ctx.state.user;

      if (!title || !content) {
        ctx.throw(400, "标题、内容是必填项");
      }

      const dynamic = new Dynamic({
        type,
        title,
        content,
        images,
        weixin,
        location,
        datetimerange,
        phone,
        authorInfo: {
          openid: user.openid, // 作者的openid
          nickname: user.userInfo.nickName, // 作者的昵称
          avatarUrl: user.userInfo.avatarUrl, // 作者的头像
          intro: user.intro, // 作者的介绍
        },
      });

      await dynamic.save();

      ctx.body = {
        success: true,
        code: 200,
        data: dynamic,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async registerDynamic(ctx) {
    try {
      const { id } = ctx.request.body;

      // 从认证中间件获取用户信息
      const user = ctx.state.user;

      await Dynamic.findOneAndUpdate(
        {
          _id: id,
          "registers.openid": { $ne: user.openid },
        },
        {
          $push: {
            registers: {
              openid: user.openid,
              nickname: user.userInfo.nickName,
              phone: user.phone,
              avatarUrl: user.userInfo.avatarUrl,
              createdAt: Date.now(),
            },
          },
        },
        { returnDocument: "after" }
      );

      ctx.body = {
        success: true,
        code: 200,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async getDynamics(ctx) {
    try {
      // 获取查询参数
      const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        author,
        title,
      } = ctx.query;

      // 构建查询条件
      const query = {};

      if (author) {
        query.author = author;
      }

      if (title) {
        query.title = { $regex: title, $options: "i" }; // 模糊搜索，不区分大小写
      }

      // 执行查询
      const dynamics = await Dynamic.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        // .populate('author', 'username avatar') // 关联作者信息，只返回用户名和头像
        .exec();

      // 获取总文档数用于分页
      //   const total = await Dynamic.countDocuments(query);

      ctx.body = {
        code: 200,
        success: true,
        data: {
          dynamics,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            // total,
            // pages: Math.ceil(total / limit)
          },
        },
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async getDynamicById(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        ctx.throw(400, "帖子ID不能为空");
      }

      const dynamic = await Dynamic.findById(id);

      if (!dynamic) {
        ctx.throw(404, "帖子未找到");
      }

      ctx.body = {
        code: 200,
        success: true,
        data: dynamic,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateDynamicViews(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        ctx.throw(400, "帖子ID不能为空");
      }

      await Dynamic.findOneAndUpdate(
        { _id: id },
        { $inc: { viewCount: 1 } } // 使用 $inc 实现递增
      );

      ctx.body = {
        code: 200,
        success: true,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateDynamicLikes(ctx) {
    try {
      const { id } = ctx.params;
      const { num } = ctx.query;

      if (!id) {
        ctx.throw(400, "帖子ID不能为空");
      }

 

          const dynamic = await Dynamic.findOneAndUpdate(
      { _id: id },
      { $inc: { likeCount: num } },
      { new: true, select: 'authorInfo' } // 返回更新后的作者字段
    );

    if (!dynamic) ctx.throw(404, "动态不存在");

      const user = ctx.state.user;

      const updateOperation = num == 1 
        ? { $addToSet: { likes: id } } 
        : { $pull: { likes: id } };

      await User.findOneAndUpdate(
        { openid: user.openid },
        updateOperation,
        { new: true } // 返回更新后的文档
      );

      if (num == 1 ) {
      await Message.create({
        type: "interactive",
        relatedId: user.openid,
        userId: dynamic.authorInfo.openid,
        dynamic: id,
        title: '点赞消息',
        content: `用户 ${user.userInfo.nickName || ''} 点赞了你的动态`
      });
    }


      ctx.body = {
        code: 200,
        success: true,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

    static async updateDynamicComments(ctx) {
    try {
      const { id } = ctx.params;
      const { num } = ctx.query;

      if (!id) {
        ctx.throw(400, "帖子ID不能为空");
      }

      await Dynamic.findOneAndUpdate(
        { _id: id },
        { $inc: { commentCount: num } } // 使用 $inc 实现递增
      );

      const user = ctx.state.user;

      const updateOperation = num == 1 
        ? { $addToSet: { likes: id } } 
        : { $pull: { likes: id } };

      await User.findOneAndUpdate(
        { openid: user.openid },
        updateOperation,
        { new: true } // 返回更新后的文档
      );


      ctx.body = {
        code: 200,
        success: true,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async updateDynamicCollects(ctx) {
    try {
      const { id } = ctx.params;
      const { num } = ctx.query;

      if (!id) {
        ctx.throw(400, "帖子ID不能为空");
      }

      await Dynamic.findOneAndUpdate(
        { _id: id },
        { $inc: { collectCount: num } } // 使用 $inc 实现递增
      );

      const user = ctx.state.user;

      const updateOperation = num == 1 
        ? { $addToSet: { collects: id } } 
        : { $pull: { collects: id } };

      await User.findOneAndUpdate(
        { openid: user.openid },
        updateOperation,
        { new: true } // 返回更新后的文档
      );

      ctx.body = {
        code: 200,
        success: true,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = DynamicController;
