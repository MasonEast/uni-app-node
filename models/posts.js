const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const postSchema = new Schema({
  _id: ObjectId,
  title: String,
  content: String,
  images: [String], // 图片URL数组
  authorId: ObjectId, // 关联users._id
  authorInfo: {
    // 冗余存储作者信息，避免频繁联表查询
    nickname: String,
    avatarUrl: String,
  },
  viewCount: Number,
  likeCount: Number,
  commentCount: Number,
  category: String, // 分类
  tags: [String], // 标签
  status: String, // 'published', 'deleted', 'draft'
  isTop: Boolean, // 是否置顶
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Posts", postSchema);
