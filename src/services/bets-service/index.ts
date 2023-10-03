import betRepository from '@/repositories/bets-repository';
import { unauthorizedError, gameBetError, insufficientBalanceError } from '@/errors';
import participantService from '../participants-service';
import gameService from '../games-service';
import participantRepository from '@/repositories/participant-repository';

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
  await updateParticipantBalance(participant.id, participant.balance, betValue);

  return bet;
}

async function validateBetParticipant(participantBalance: number, amountBet: number) {
  const valueConvert = 100;
  const betValue = amountBet * valueConvert;

  if (betValue > participantBalance) throw insufficientBalanceError();
  return betValue;
}

async function updateParticipantBalance(id: number, participantBalance: number, betValue: number,) {
  const curentBalance = participantBalance - betValue;
  await participantRepository.updateBalance(curentBalance, id);
}

const betService = {
  createBet,
};

export default betService;
