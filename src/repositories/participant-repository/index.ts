import { prisma } from '@/config';

async function create(name: string, balance: number) {
  return prisma.participant.create({
    data: { name, balance }
  });
}

async function findAll() {
  return prisma.participant.findMany({});
}

const participantRepository = {
  create,
  findAll,
}

export default participantRepository;