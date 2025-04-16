# 登录

​ 小程序端调用 uni.login 获取 code
将 code 发送到 Koa 后端
​Koa 后端使用 code 向微信服务器请求 openid 和 session_key
​Koa 后端根据 openid 处理用户信息（创建或更新）
​Koa 后端生成自定义登录态（token）并返回给小程序
​ 小程序端存储 token 和用户信息，完成登录

** 确保你的 Koa 服务器使用 HTTPS，微信要求所有接口必须为 HTTPS **
