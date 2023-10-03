import { Request, Response } from 'express';
import participantService from '@/services/participants-service';
import { ParticipantBody } from '@/protocols';

export async function createParticipant(req: Request, res: Response) {
  const { name, balance } = req.body as ParticipantBody;

  const participant = await participantService.createParticipant(name, balance);
  res.send(participant);
}

export async function getAllParticipants(req: Request, res: Response) {
  const participants = participantService.getAllParticipants();
  res.send(participants);
}