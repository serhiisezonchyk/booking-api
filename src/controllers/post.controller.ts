import { Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { db } from '../db';
import { TypeProperty, TypeType } from './../../../client/src/data/types';
import { JwtType } from './auth.controller';
interface Query {
  type?: TypeType;
  city?: string;
  property?: TypeProperty;
  minPrice?: number;
  maxPrice?: number;
  bedroom?: number;
}

export const getPosts = async (req: Request, res: Response) => {
  const query = req.query as Query;
  try {
    const posts = await db.post.findMany({
      where: {
        city: { startsWith: query.city, mode: 'insensitive' },
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: +query.bedroom! || undefined,
        price: {
          gte: +query.minPrice! || 0,
          lte: +query.maxPrice! || 99999999,
        },
      },
    });
    // console.log(posts);
    res.status(200).json({ posts: posts });
  } catch (error) {
    logger.error('Get posts failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        postDetails: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    let userId: null | string = null;
    const { token } = req.cookies;
    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.SECRET_KEY, async (error: VerifyErrors | any, decoded: any) => {
        const decodedValue: JwtType = decoded;
        if (error) userId = null;
        else userId = decodedValue.id;
      });
    }
    const saved = await db.savedPost.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId: userId || '',
        },
      },
    });
    res.status(200).json({ post: { ...post, isSaved: saved ? true : false } });
  } catch (error) {
    logger.error('Get post by id failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const addPost = async (req: Request, res: Response) => {
  const { postDetails, postData } = req.body;
  const tokenId = req.user?.id;

  //   if (id !== tokenId) return res.status(403).json({ error: 'Not authorized' });
  try {
    const post = await db.post.create({
      data: {
        ...postData,
        userId: tokenId,
        postDetails: {
          create: postDetails,
        },
      },
    });
    res.status(200).json({ post });
  } catch (error) {
    logger.error('Get post by id failed');
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tokenId = req.user?.id;

  try {
    const post = await db.post.findUnique({
      where: { id },
    });
    if (post?.userId !== tokenId) return res.status(403).json({ error: 'Not authorized' });
    await db.post.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    logger.error('Get post by id failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { body } = req;
  const tokenId = req.user?.id;

  //   if (id !== tokenId) return res.status(403).json({ error: 'Not authorized' });
  try {
    const post = await db.post.create({
      data: {
        ...body,
        userId: tokenId,
      },
    });
    res.status(200).json({ post });
  } catch (error) {
    logger.error('Get post by id failed');
    res.status(500).json({ error: 'Something went wrong' });
  }
};
