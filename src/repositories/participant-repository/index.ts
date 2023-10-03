import { prisma } from '@/config';

async function create(name: string, balance: number) {
  return await prisma.participant.create({
    data: { name, balance },
  });
}

async function findAll() {
  return await prisma.participant.findMany({});
}

const participantRepository = {
  create,
  findAll,
};

export default participantRepository;
