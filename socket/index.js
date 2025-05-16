// socket/index.js
const { createServer } = require('http');
const { Server } = require('socket.io');
const Message = require('../models/message');

module.exports = (app) => {
  const server = createServer(app.callback());
  const io = new Server(server, {
    cors: {
      origin: "*", // 按需调整
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    // 身份验证（与原有JWT中间件结合）
    const token = socket.handshake.query.token;
    // 添加JWT验证逻辑[4,5](@ref)
    next();
  });

  io.on('connection', (socket) => {
    console.log(`用户 ${socket.userId} 已连接`);

    // 消息创建监听
    socket.on('new_message', async (msg) => {
      const savedMsg = await Message.create(msg);
      io.to(`user_${msg.userId}`).emit('message_update', savedMsg); // 实时推送
    });

    // 加入用户专属房间
    socket.join(`user_${socket.userId}`);
  });

  return server;
};