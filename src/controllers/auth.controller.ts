import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
export interface JwtType {
  id: string;
};

const generateJwt = ({ id }: JwtType, age: number): string | null => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: age });
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password }: { username: string; email: string; password: string } = req.body;
  try {
    const isExist = await db.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
    });
    if (isExist) return res.status(401).json({ error: 'This user is already exist.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'Success' });
  } catch (error) {
    logger.error('Failed to create new user.');
    res.status(500).json({ error: 'Failed to create user.', details: error });
  }
};
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) return res.status(401).json({ error: 'Invalid credentials' });

    //without cookie parser
    // res.setHeader("Set-Cookie", "test="+'myvalue').json({message:'Success.'})

    const age: number = 1000 * 60 * 60 * 24 * 7;
    const token = generateJwt({ id: user.id }, age);

    const { password: userPassword, ...userInfo } = user;

    //with cookie parser, secure for https
    res
      .cookie('token', token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: 'Login successful.', user: userInfo });
  } catch (error) {
    logger.error('Login failed');
    res.status(500).json({ error: 'Failed to login' });
  }
};
export const logout = (req: Request, res: Response) => {
  logger.info('User logged out.');
  res.clearCookie('token').status(200).json({ message: 'Success' });
};
