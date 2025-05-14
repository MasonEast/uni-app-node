const Comment = require('../models/comments');

// 创建评论
exports.createComment = async (ctx) => {
  try {
    const { content, dynamicId } = ctx.request.body;
    const user = ctx.state.user;
     await Comment.create({
      content,
      author: user._id, // 从JWT获取用户ID
      dynamicId
    });
    ctx.body = {
        success: true,
        code: 200,
      };
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
        success: false,
        code: 500,
        message: '创建评论失败',
        error: err.message
      };
  }
};

// 回复评论
exports.replyComment = async (ctx) => {
  try {
    const parentComment = await Comment.findById(ctx.params.commentId);
    const user = ctx.state.user;
    parentComment.replies.push({
      content: ctx.request.body.content,
      author: user._id
    });
    await parentComment.save();
    ctx.status = 201;
    ctx.body = { 
        data: parentComment,  
        success: true,
        code: 200, 
    };
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.throw(500, '回复失败');
  }
};

// 获取评论列表（带分页）
exports.getComments = async (ctx) => {
  try {
    const { dynamicId } = ctx.params;
    const { page = 1, limit = 10 } = ctx.query;
    
    const comments = await Comment.find({ dynamicId })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('author', 'userInfo') // 联表查询用户信息
        .sort({ createdAt: -1 });

    ctx.body = { 
        data: comments,  
        success: true,
        code: 200, 
    };
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { 
        success: false,
        code: 500,
        message: '获取评论失败',
        error: err.message
      };
  }
};