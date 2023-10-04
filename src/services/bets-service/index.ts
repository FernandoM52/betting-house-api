import { unauthorizedError, gameBetError, insufficientBalanceError } from '@/errors';
import betRepository from '@/repositories/bets-repository';
import participantService from '../participants-service';
import gameService from '../games-service';
import { Status } from '@prisma/client';

export async function createBet(
  homeTeamScore: number,
  awayTeamScore: number,
  amountBet: number,
  gameId: number,
  participantId: number,
) {
  const participant = await participantService.getParticipant(participantId);
  if (!participant) throw unauthorizedError();

  const game = await gameService.getGame(gameId);
  if (game.isFinished) throw gameBetError();

  const betValue = await validateBetParticipant(participant.balance, amountBet);
  const bet = await betRepository.create(homeTeamScore, awayTeamScore, betValue, gameId, participantId);

  const curentBalance = participant.balance - betValue;
  await participantService.updateParticipantBalance(participant.id, curentBalance);
  return bet;
}

export async function updateBetStatusAndAmount(betId: number, status: Status, amountWon: number) {
  await betRepository.updateBetStatusAndAmount(betId, status, amountWon);
}

async function validateBetParticipant(participantBalance: number, amountBet: number) {
  const valueConvert = 100;
  const betValue = amountBet * valueConvert;

  if (betValue > participantBalance) throw insufficientBalanceError();
  return betValue;
}

const betService = {
  createBet,
  updateBetStatusAndAmount,
};

export default betService;
