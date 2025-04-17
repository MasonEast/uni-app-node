const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Number, default: 1 }, // 1-正常 0-禁用
});

// 添加索引
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// 更新时间戳
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// 静态方法
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// 实例方法
userSchema.methods.verifyPassword = function (password) {
  return this.password === password; // 实际项目中应该使用加密比较
};

module.exports = mongoose.model("User", userSchema);
