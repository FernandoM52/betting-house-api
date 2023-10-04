import { Game } from '@prisma/client';
import { prisma } from '@/config';
import { faker } from '@faker-js/faker';

export async function createGame(homeTeamName?: string, awayTeamName?: string): Promise<Game> {
  return prisma.game.create({
    data: {
      homeTeamName: homeTeamName || faker.lorem.word(),
      awayTeamName: awayTeamName || faker.lorem.word(),
    },
  });
}

export async function createFinishedGame(homeTeamName?: string, awayTeamName?: string): Promise<Game> {
  return prisma.game.create({
    data: {
      homeTeamName: homeTeamName || faker.lorem.word(),
      awayTeamName: awayTeamName || faker.lorem.word(),
      isFinished: true,
    },
  });
}

export function gameWithouHomeTeam() {
  return {
    homeTeamName: '',
    awayTeamName: faker.lorem.word(),
  };
}

export function gameWithouAwayTeam() {
  return {
    homeTeamName: faker.lorem.word(),
    awayTeamName: '',
  };
}
