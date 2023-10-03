import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createGameSchema, finishGameSchema } from '@/schemas';
import { createGame, finishGame, getAllGames, getGame } from '@/controllers/games-controller';

const gamesRouter = Router();
gamesRouter.post('/', validateBody(createGameSchema), createGame);
gamesRouter.post('/:id/finish', validateBody(finishGameSchema), finishGame);
gamesRouter.get('/:id', getGame);
gamesRouter.get('/', getAllGames);

export { gamesRouter };
