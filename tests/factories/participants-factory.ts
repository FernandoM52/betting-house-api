import { faker } from '@faker-js/faker';
import { Participant } from '@prisma/client';
import { prisma } from '@/config';

export async function createParticipant(name?: string, balance?: number): Promise<Participant> {
  return prisma.participant.create({
    data: {
      name: name || faker.person.fullName(),
      balance: balance || faker.number.int({ min: 10, max: 100000 }),
    },
  });
}

export function participantWithoutName() {
  return {
    name: '',
    balance: faker.number.int({ min: 10, max: 100000 }),
  };
}

export function participantWithoutBalance() {
  return {
    name: faker.person.fullName(),
    balance: '',
  };
}
