import dotenv from 'dotenv';
import z from 'zod';
dotenv.config();
const envSchema = z.object({
  SECRET_KEY: z.string().min(6),
  DATABASE_URL: z.string().min(1),
  PORT: z.number().default(3000),
  CLIENT_URL: z.string().optional(),
  //   DATABASE_URL: z.string().optional(),
});

const { SECRET_KEY, DATABASE_URL, PORT, CLIENT_URL } = process.env;

const parsedResult = envSchema.safeParse({
  SECRET_KEY,
  DATABASE_URL,
  PORT: +PORT,
  CLIENT_URL,
});
if (!parsedResult.success) {
  console.log(parsedResult.error);
  throw new Error('Environment don`t match the schema.');
}

export const envVariables = parsedResult.data;

type EnvVariablesSchemaType = z.infer<typeof envSchema>;
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariablesSchemaType {}
  }
}
