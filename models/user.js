const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const userSchema = new Schema({
  phone: String,
  openid: String,
  userInfo: { type: Object, default: {} }, // 用户信息
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Number, default: 1 }, // 1-正常 0-禁用
  avatar: String,
  nickname: String,
  intro: String,
  gender: { type: Number, default: 0 }, // 0-未知 1-男 2-女
  city: String,
  province: String,
  country: String,
  community: String, // 小区
  address: String, // 详细地址
  likes: { type: Array, default: [] }, // 点赞
  publish: { type: Array, default: [] }, // 发布
  news: { type: Object, default: {} }, // 消息
  comment: { type: Array, default: [] }, // 评论
  role: String, // 'user', 'admin', 'moderator'等
  points: Number, // 积分
});

// 添加索引
// userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });

// // 更新时间戳
// userSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // 静态方法
// userSchema.statics.findByUsername = function (username) {
//   return this.findOne({ username });
// };

// // 实例方法
// userSchema.methods.verifyPassword = function (password) {
//   return this.password === password; // 实际项目中应该使用加密比较
// };

module.exports = mongoose.model("User", userSchema);
