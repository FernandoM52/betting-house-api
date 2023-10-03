import { prisma } from '@/config';

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

const betRepository = {
  create,
};

export default betRepository;
