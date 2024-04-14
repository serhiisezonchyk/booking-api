import * as z from 'zod';

export const userRegisterSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).email('Invalid email.'),
  username: z.string().min(8, 'Username must be 8 or more s.'),
  password: z.string().min(8, 'Password must be 8 or more s.'),
});
export const userLoginSchema = z.object({
  username: z.string().min(1, 'Username is requred'),
  password: z.string().min(1, 'Password is requred'),
});
