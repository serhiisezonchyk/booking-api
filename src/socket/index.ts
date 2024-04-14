import { Server, Socket } from 'socket.io';

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
export default function socketEvents(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('newUser', (userId: string) => {
      addUser(userId, socket.id);
    });
    socket.on('disconnect', () => {
      removeUser(socket.id);
    });
    socket.on('sendMessage', ({ receiverId, data }: { receiverId: string; data: string }) => {
      const receiver = getUser(receiverId);
      console.log('*********************');
      console.log('data', data);
      console.log('online', onlineUsers);
      console.log('receiver', receiver);
      console.log('*********************');
      io.to(receiver?.socketId!).emit('getMessage', data);
    });
  });
}
