import { Request, Response } from 'express';
import { CreateBetBody } from '@/protocols';
import httpStatus from 'http-status';
import betService from '@/services/bets-service';

export async function createBet(req: Request, res: Response) {
  const { homeTeamScore, awayTeamScore, amountBet, gameId, participantId } = req.body as CreateBetBody;

  const bet = await betService.createBet(homeTeamScore, awayTeamScore, amountBet, gameId, participantId);

  res.status(httpStatus.CREATED).send(bet);
}
