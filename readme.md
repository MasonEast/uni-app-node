# 登录

​ 小程序端调用 uni.login 获取 code
将 code 发送到 Koa 后端
​Koa 后端使用 code 向微信服务器请求 openid 和 session_key
​Koa 后端根据 openid 处理用户信息（创建或更新）
​Koa 后端生成自定义登录态（token）并返回给小程序
​ 小程序端存储 token 和用户信息，完成登录

** 确保你的 Koa 服务器使用 HTTPS，微信要求所有接口必须为 HTTPS **

## 手机登录

用户点击手机号登录按钮：触发微信获取手机号功能
​ 获取加密数据：微信返回加密的手机号数据(encryptedData)和初始向量(iv)
​ 发送到服务器：将加密数据和微信登录 code 一起发送到 Koa 服务器
​ 服务器处理：
使用 code 获取 session_key
使用 session_key 解密手机号
查询或创建用户记录
生成登录 token
​ 返回登录结果：将 token 和用户信息返回给小程序
​ 小程序处理：保存 token 和用户信息，完成登录
