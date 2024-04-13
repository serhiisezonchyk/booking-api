import { Server, Socket } from 'socket.io';

export default function socketEvents(io: Server){
  io.on('connection',(socket: Socket)=>{
    console.log('socket')
  })  
};
