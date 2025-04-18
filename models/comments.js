const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const commentSchema = new Schema({
  _id: ObjectId,
  postId: ObjectId, // 关联posts._id
  content: String,
  authorId: ObjectId, // 关联users._id
  authorInfo: {
    // 冗余存储作者信息
    nickname: String,
    avatarUrl: String,
  },
  replyTo: ObjectId, // 回复的评论ID，为空则为直接评论帖子
  replyToUser: {
    // 被回复的用户信息
    userId: ObjectId,
    nickname: String,
  },
  likeCount: Number,
  status: String, // 'published', 'deleted'
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Comments", commentSchema);
