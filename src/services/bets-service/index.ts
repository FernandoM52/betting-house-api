import betRepository from '@/repositories/bets-repository';
import participantRepository from '@/repositories/participant-repository';
import gameRepository from '@/repositories/games-repository';
import { unauthorizedError, gameBetError } from '@/errors';

export async function createBet(
  homeTeamScore: number,
  awayTeamScore: number,
  amountBet: number,
  gameId: number,
  participantId: number,
) {
  await validateParticipantAndGameId(participantId, gameId);

  const valueConvert = 100;
  const betValue = amountBet * valueConvert;

  const bet = await betRepository.create(homeTeamScore, awayTeamScore, betValue, gameId, participantId);
  return bet;
}

async function validateParticipantAndGameId(participantId: number, gameId: number) {
  const participant = await participantRepository.findById(participantId);
  if (!participant) throw unauthorizedError();

  const game = await gameRepository.findById(gameId);
  if (!game) throw gameBetError();
}

const betService = {
  createBet,
};

export default betService;
