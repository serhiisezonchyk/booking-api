import { Request, Response } from 'express';
import { db } from '../db';

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
    const message = db.message.create({
      data: {
        text,
        chatId,
        userId: tokenId!,
      },
    });
    await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenId!],
        lastMessage: text,
      },
    });
    res.status(200).json({ message });
  } catch (error) {
    logger.error('Post message failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};
