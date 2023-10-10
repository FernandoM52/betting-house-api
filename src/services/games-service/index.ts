import { gameAlreadyFinishedError, invalidParamsError, notFoundError } from '@/errors';
import gameRepository from '@/repositories/games-repository';
import betRepository from '@/repositories/bets-repository';
import participantService from '../participants-service';
import betService from '../bets-service';
import { calculateBetAmountWon } from '@/utils';

export async function createGame(homeTeamName: string, awayTeamName: string) {
  const game = await gameRepository.create(homeTeamName, awayTeamName);
  return game;
}

export async function finishGame(gameId: number, homeTeamScore: number, awayTeamScore: number) {
  const game = await validateGameId(gameId);
  if (game.isFinished) throw gameAlreadyFinishedError();

  const result = await gameRepository.finish(game.id, homeTeamScore, awayTeamScore);
  await finishGameProcess(gameId, homeTeamScore, awayTeamScore);

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

async function finishGameProcess(gameId: number, homeTeamScore: number, awayTeamScore: number) {
  const winningBets = await betRepository.getWinningBets(gameId, homeTeamScore, awayTeamScore);
  const winningBetsTotalAmount = winningBets.reduce((total, bet) => total + bet.amountBet, 0);
  const winningBetIds = new Set(winningBets.map((winningBet) => winningBet.id));

  const totalBets = await betRepository.getAllBets(gameId);
  const betsTotalAmount = totalBets.reduce((total, bet) => total + bet.amountBet, 0);

  for (const bet of winningBets) {
    const amountWon = await calculateBetAmountWon(bet, winningBetsTotalAmount, betsTotalAmount);
    await betService.updateBetStatusAndAmount(bet.id, 'WON', amountWon);
    await participantService.updateParticipantBalance(bet.participantId, amountWon);
  }

  for (const bet of totalBets) {
    if (!winningBetIds.has(bet.id)) {
      await betService.updateBetStatusAndAmount(bet.id, 'LOST', 0);
    }
  }
}

const gameService = {
  createGame,
  finishGame,
  getGame,
  getAllGames,
};

export default gameService;
