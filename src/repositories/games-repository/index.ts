import { prisma } from '@/config';

async function create(homeTeamName: string, awayTeamName: string) {
  return await prisma.game.create({
    data: { homeTeamName, awayTeamName },
  });
}

async function finish(gameId: number, homeTeamScore: number, awayTeamScore: number) {
  return await prisma.game.update({
    where: { id: gameId },
    data: { homeTeamScore, awayTeamScore },
  });
}

async function findById(gameId: number) {
  return await prisma.game.findFirst({
    where: { id: gameId },
    include: { Bet: true },
  });
}

async function findAll() {
  return await prisma.game.findMany({});
}

const gameRepository = {
  create,
  finish,
  findById,
  findAll,
};

export default gameRepository;
