export interface ServerToClientEvents{
    getMessage:(data:string)=>void;
}

export interface ClientToServerEvents {
    newUser:(userId:string)=>void;
    disconnect:()=>void;
    sendMessage:(data:{ receiverId: string; data: string })=>void;
  }