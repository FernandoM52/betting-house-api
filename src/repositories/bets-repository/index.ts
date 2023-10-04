import { prisma } from '@/config';
import { Status } from '@prisma/client';

async function create(
  homeTeamScore: number,
  awayTeamScore: number,
  amountBet: number,
  gameId: number,
  participantId: number,
) {
  return await prisma.bet.create({
    data: {
      homeTeamScore,
      awayTeamScore,
      amountBet,
      gameId,
      participantId,
    },
  });
}

async function getWinningBets(gameId: number, homeTeamScore: number, awayTeamScore: number) {
  return prisma.bet.findMany({
    where: {
      gameId,
      homeTeamScore,
      awayTeamScore,
      status: 'PENDING',
    },
  });
}

async function getAllBets(gameId: number) {
  return prisma.bet.findMany({
    where: { gameId, status: 'PENDING' },
  });
}

async function updateBetStatusAndAmount(betId: number, status: Status, amountWon: number) {
  return prisma.bet.update({
    where: { id: betId },
    data: {
      status,
      amountWon,
    },
  });
}

const betRepository = {
  create,
  getWinningBets,
  getAllBets,
  updateBetStatusAndAmount,
};

export default betRepository;
