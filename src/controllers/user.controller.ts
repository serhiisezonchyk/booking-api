import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { db } from '../db';
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany();
    res.status(200).json({ users: users });
  } catch (error) {
    logger.error('Get users failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    res.status(200).json({ user });
  } catch (error) {
    logger.error('Get user by id failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenId = req.user?.id;
  const { password, checkPassword, avatar, ...body } = req.body;

  if (id !== tokenId) return res.status(403).json({ error: 'Not authorized' });

  try {
    let updatedPassport = null;
    if (password && checkPassword) {
      if (password !== checkPassword) {
        return res.status(403).json({ error: 'Password dont same' });
      }
      updatedPassport = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...body,
        ...(updatedPassport && { password: updatedPassport }),
        ...(avatar && { avatar }),
      },
    });
    const { password: pass, ...user } = updatedUser;
    res.status(200).json({ user });
  } catch (error) {
    logger.error('User updating failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenId = req.user?.id;
  if (id !== tokenId) return res.status(403).json({ error: 'Not authorized' });

  try {
    await db.user.delete({
      where: { id },
      select: {
        password: false,
      },
    });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    logger.error('User deleting failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const savePost = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const tokenId = req.user?.id;

  try {
    const savedPost = await db.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenId!,
          postId,
        },
      },
    });
    if (savedPost) {
      await db.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: 'Post removed from saved list' });
    } else {
      await db.savedPost.create({
        data: {
          userId: tokenId!,
          postId,
        },
      });
      res.status(200).json({ message: 'Post saved to saved list' });
    }
  } catch (error) {
    logger.error('User deleting failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getProfilePosts = async (req: Request, res: Response) => {
  const tokenId = req.user?.id;

  try {
    const userPosts = await db.post.findMany({
      where: {
        userId: tokenId,
      },
    });
    const savedPostData = await db.savedPost.findMany({
      where: {
        userId: tokenId,
      },
      include: {
        post: true,
      },
    });
    const savedPosts = savedPostData.map((el) => el.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    logger.error('Get profile posts failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};
