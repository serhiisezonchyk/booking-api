import { Request, Response } from 'express';
import { db } from '../db';

export const getChats = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;

  try {
    const chats = await db.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenId!],
        },
      },
    });
    res.status(200).json();
  } catch (error) {
    logger.error('Get chats failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getChat = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;

  try {
    const chat = db.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenId!],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    await db.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenId!],
        },
      },
    });
    res.status(200).json({ chat });
  } catch (error) {
    logger.error('Get users failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const addChat = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;

  try {
    const newChat = await db.chat.create({
      data: {
        userIDs: [tokenId, req.body.receiverId],
      },
    });
    res.status(200).json({ newChat });
  } catch (error) {
    logger.error('Get users failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const readChat = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;

  try {
    const chat = await db.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenId!],
        },
      },
      data: {
        seenBy: {
          push: [tokenId!],
        },
      },
    });
    res.status(200).json({ chat });
  } catch (error) {
    logger.error('Get users failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};
