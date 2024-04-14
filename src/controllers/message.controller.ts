import { Request, Response } from 'express';
import { db } from '../db';

export const sendFirstMessage = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;
  const { receiverId } = req.params;
  const { text } = req.body;
  try {
    let chatId;
    const usersChat = await db.chat.findFirst({
      where: {
        AND: [{ userIDs: { has: receiverId } }, { userIDs: { has: tokenId } }],
      },
      select: {
        id: true,
      },
    });

    if (!usersChat) {
      const newChat = await db.chat.create({
        data: {
          userIDs: [tokenId!, receiverId],
        },
        select: {
          id: true,
        },
      });
      chatId = newChat.id;
    } else {
      chatId = usersChat.id;
    }
    if (!chatId) return res.status(404).json({ error: 'Chat not found' });
    const message = await db.message.create({
      data: {
        text,
        chatId,
        userId: tokenId!,
      },
    });

    const currentTime = new Date();

    await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenId!],
        lastMessage: text,
        lastMessageTime: currentTime,
      },
    });

    res.status(200).json({ message });
  } catch (error) {
    console.error('Error sending first message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;
  const { chatId } = req.params;
  const { text } = req.body;
  try {
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenId!],
        },
      },
    });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    const message = await db.message.create({
      data: {
        text,
        chatId,
        userId: tokenId!,
      },
    });
    const currentTime = new Date();

    await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenId!],
        lastMessage: text,
        lastMessageTime: currentTime,
      },
    });
    res.status(200).json({ message });
  } catch (error) {
    logger.error('Post message failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};
