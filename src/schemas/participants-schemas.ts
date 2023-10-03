import Joi from 'joi';
import { CreateParticipantParams } from '@/services/participants-service';

export const createParticipantSchema = Joi.object<CreateParticipantParams>({
  name: Joi.string().min(3).trim().required(),
  balance: Joi.number().min(10).required(),
});