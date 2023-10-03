import { gameAlreadyFinishedError, invalidParamsError, notFoundError } from '@/errors';
import gameRepository from '@/repositories/games-repository';

export async function createGame(homeTeamName: string, awayTeamName: string) {
  const game = await gameRepository.create(homeTeamName, awayTeamName);
  return game;
}

export async function finishGame(gameId: number, homeTeamScore: number, awayTeamScore: number) {
  const game = await validateGameId(gameId);
  if (game.isFinished) throw gameAlreadyFinishedError();

  const result = await gameRepository.finish(game.id, homeTeamScore, awayTeamScore);
  return result;
}

export async function getGame(gameId: number) {
  const game = await validateGameId(gameId);
  return game;
}

export async function getAllGames() {
  const games = await gameRepository.findAll();
  return games;
}

async function validateGameId(gameId: number) {
  if (isNaN(gameId) || gameId < 0) throw invalidParamsError();

  const game = await gameRepository.findById(gameId);
  if (!game) throw notFoundError();

  return game;
}

const gameService = {
  createGame,
  finishGame,
  getGame,
  getAllGames,
};

export default gameService;
