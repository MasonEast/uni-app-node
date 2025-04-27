const Post = require("../models/posts");

class PostController {
  // 创建新帖子
  static async createPost(ctx) {
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

      if (!title || !content || !weixin) {
        ctx.throw(400, "标题、内容和微信是必填项");
      }

      const post = new Post({
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

      await post.save();

      ctx.body = {
        success: true,
        code: 200,
        data: post,
      };
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        success: false,
        message: error.message,
      };
    }
  }

  static async getPosts(ctx) {
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
      const posts = await Post.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        // .populate('author', 'username avatar') // 关联作者信息，只返回用户名和头像
        .exec();

      // 获取总文档数用于分页
      //   const total = await Post.countDocuments(query);

      ctx.body = {
        code: 200,
        success: true,
        data: {
          posts,
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

  static async getPostById(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        ctx.throw(400, "帖子ID不能为空");
      }

      const post = await Post.findById(id);

      if (!post) {
        ctx.throw(404, "帖子未找到");
      }

      ctx.body = {
        code: 200,
        success: true,
        data: post,
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

module.exports = PostController;
