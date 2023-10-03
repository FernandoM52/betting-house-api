import 'express-async-errors';
import express, { Express } from 'express';
import { connectDb, disconnectDb, loadEnv } from '@/config';

loadEnv();

const app = express();
app.use(express.json());

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDb();
}

export default app;
