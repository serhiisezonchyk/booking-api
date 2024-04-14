import { Message } from '@prisma/client';

export interface ServerToClientEvents{
    getMessage:(data:Message)=>void;
}

export interface ClientToServerEvents {
    newUser:(userId:string)=>void;
    disconnect:()=>void;
    sendMessage:(data:{ receiverId: string; data: Message })=>void;
  }