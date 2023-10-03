import { faker } from '@faker-js/faker';
import { Participant } from '@prisma/client';
import { prisma } from '@/config';

export async function createParticipant(params: Partial<Participant> = {}): Promise<Participant> {
  return prisma.participant.create({
    data: {
      name: params.name || faker.person.fullName(),
      balance: params.balance || faker.number.int({ min: 1000 }),
    },
  });
}

export function participantWithoutName() {
  return {
    name: '',
    balance: faker.number.int({ min: 1000 }),
  };
}

export function participantWithoutBalance() {
  return {
    name: faker.person.fullName(),
    balance: '',
  };
}
