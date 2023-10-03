import { Request, Response } from 'express';
import { CreateGameBody, FinishGameBody } from '@/protocols';
import httpStatus from 'http-status';
import gameService from '@/services/games-service';

export async function createGame(req: Request, res: Response) {
  const { homeTeamName, awayTeamName } = req.body as CreateGameBody;

  const game = await gameService.createGame(homeTeamName, awayTeamName);
  res.status(httpStatus.CREATED).send(game);
}

export async function finishGame(req: Request, res: Response) {
  const { homeTeamScore, awayTeamScore } = req.body as FinishGameBody;
  const { id } = req.params;

  const game = await gameService.finishGame(Number(id), homeTeamScore, awayTeamScore);
  res.status(httpStatus.CREATED).send(game);
}

export async function getGame(req: Request, res: Response) {
  const { id } = req.params;

  const game = await gameService.getGame(Number(id));
  res.send(game);
}

export async function getAllGames(req: Request, res: Response) {
  const games = await gameService.getAllGames();
  res.send(games);
}
