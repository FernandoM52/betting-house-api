import { Participant } from '@prisma/client';
import { minBalanceError } from '@/errors';
import participantRepository from '@/repositories/participant-repository';

export async function createParticipant(name: string, balance: number) {
  const balanceInCents = await validateBalance(balance);

  const participant = await participantRepository.create(name, balanceInCents);
  return participant;
}

export async function getAllParticipants() {
  const participants = await participantRepository.findAll();
  return participants;
}

export async function getParticipant(participantId: number) {
  const participant = await participantRepository.findById(participantId);
  return participant;
}

async function validateBalance(balance: number) {
  const minBalance = 1000;
  const valueConvert = 100;
  const balanceInCents = balance * valueConvert;

  if (balanceInCents < minBalance) throw minBalanceError();
  return balanceInCents;
}

export type CreateParticipantParams = Pick<Participant, 'name' | 'balance'>;

const participantService = {
  createParticipant,
  getAllParticipants,
  getParticipant,
};

export default participantService;
