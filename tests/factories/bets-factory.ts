import { prisma } from '@/config';
import { Bet } from '@prisma/client';
import { faker } from '@faker-js/faker';

interface BetReturn {
  gameId: number | null;
  participantId: number | null;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  amountBet: number | null;
}

export async function createBet(
  gameId: number,
  participantId: number,
  homeTeamScore?: number,
  awayTeamScore?: number,
  amountBet?: number,
): Promise<Bet> {
  const valueConvert = 100;

  return prisma.bet.create({
    data: {
      gameId: gameId,
      participantId: participantId,
      homeTeamScore: homeTeamScore || faker.number.int({ min: 0, max: 100 }),
      awayTeamScore: awayTeamScore || faker.number.int({ min: 0, max: 100 }),
      amountBet: amountBet * valueConvert || faker.number.int({ min: 2, max: 10 }) * valueConvert,
    },
  });
}

export function buildBetReturn(excludedField: keyof BetReturn) {
  const betReturn: BetReturn = {
    gameId: faker.number.int({ min: 1, max: 100 }),
    participantId: faker.number.int({ min: 1, max: 100 }),
    homeTeamScore: faker.number.int({ min: 0, max: 100 }),
    awayTeamScore: faker.number.int({ min: 0, max: 100 }),
    amountBet: faker.number.int({ min: 2, max: 100 }),
  };

  betReturn[excludedField] = null;

  return betReturn;
}
