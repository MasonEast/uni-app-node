const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const postSchema = new Schema({
  // _id: ObjectId,
  type: String,
  title: String,
  content: String,
  location: String, // 位置
  datetimerange: [Date], // 日期范围
  imgList: [String], // 图片URL数组
  authorId: Schema.Types.ObjectId, // 关联users._id
  authorInfo: {
    // 冗余存储作者信息，避免频繁联表查询
    nickname: String,
    avatarUrl: String,
    weixin: String,
    phone: String,
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
