import { prisma } from '@/config';

async function create(name: string, balance: number) {
  return await prisma.participant.create({
    data: { name, balance },
  });
}

async function findAll() {
  return await prisma.participant.findMany({});
}

async function findById(id: number) {
  return await prisma.participant.findFirst({
    where: { id },
  });
}

async function updateBalance(balance: number, id: number) {
  return await prisma.participant.update({
    where: { id },
    data: { balance },
  });
}

const participantRepository = {
  create,
  findAll,
  findById,
  updateBalance,
};

export default participantRepository;
