import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createBetSchema } from '@/schemas/bets-schemas';
import { createBet } from '@/controllers';

const betsRouter = Router();
betsRouter.post('/', validateBody(createBetSchema), createBet);

export { betsRouter };
