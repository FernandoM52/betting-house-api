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

const participantRepository = {
  create,
  findAll,
  findById,
};

export default participantRepository;
