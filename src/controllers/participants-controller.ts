import { Request, Response } from 'express';
import { ParticipantBody } from '@/protocols';
import httpStatus from 'http-status';
import participantService from '@/services/participants-service';

export async function createParticipant(req: Request, res: Response) {
  const { name, balance } = req.body as ParticipantBody;

  const participant = await participantService.createParticipant(name, balance);
  res.status(httpStatus.CREATED).send(participant);
}

export async function getAllParticipants(req: Request, res: Response) {
  const participants = await participantService.getAllParticipants();
  res.send(participants);
}
