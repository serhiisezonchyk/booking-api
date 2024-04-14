import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types';

interface User {
  userId: string;
  socketId: string;
}
let onlineUsers: User[] = [];
const addUser = (userId: string, socketId: string) => {
  const userExist = onlineUsers.find((user) => user.userId === userId);
  if (!userExist) onlineUsers.push({ userId, socketId });
};
const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((el) => el.socketId !== socketId);
};
const getUser = (userId: string) => {
  return onlineUsers.find((user) => user.userId === userId);
};
export default function socketEvents(io: Server<ClientToServerEvents, ServerToClientEvents>) {
  io.on('connection', (socket: Socket<ClientToServerEvents>) => {
    socket.on('newUser', (userId) => {
      addUser(userId, socket.id);
    });
    socket.on('disconnect', () => {
      removeUser(socket.id);
    });

    socket.on('sendMessage', (data) => {
      const receiver = getUser(data.receiverId);
      io.to(receiver?.socketId!).emit('getMessage', data.data);
    });
  });
}
