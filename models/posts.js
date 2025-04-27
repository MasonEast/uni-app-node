const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const postSchema = new Schema({
  // _id: ObjectId,
  type: String,
  title: String,
  content: String,
  location: String, // 位置
  datetimerange: [String], // 日期范围
  images: [String], // 图片URL数组
  authorId: Schema.Types.ObjectId, // 关联users._id
  authorInfo: {
    // 冗余存储作者信息，避免频繁联表查询
    openid: String, // 作者的openid
    nickname: String,
    avatarUrl: String,
    weixin: String,
    phone: String,
    intro: String, // 作者的介绍
  },
  registers: [
    {
      openid: String, // 报名用户的openid
      nickname: String, // 报名用户的昵称
      phone: String, // 报名用户的手机号
      avatarUrl: String, // 报名用户的头像
      createdAt: Date, // 报名时间
      status: String, // 'pending', 'approved', 'rejected'
      weixin: String, // 微信号
    },
  ], // 报名人数
  viewCount: Number,
  likeCount: Number,
  commentCount: Number,
  category: String, // 分类
  tags: [String], // 标签
  status: String, // 'published', 'deleted', 'draft'
  isTop: Boolean, // 是否置顶
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Posts", postSchema);
