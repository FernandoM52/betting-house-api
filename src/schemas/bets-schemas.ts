import Joi from 'joi';
import { CreateBetBody } from '@/protocols';

export const createBetSchema = Joi.object<CreateBetBody>({
  homeTeamScore: Joi.number().min(0).required(),
  awayTeamScore: Joi.number().min(0).required(),
  amountBet: Joi.number().positive().required(),
  gameId: Joi.number().positive().required(),
  participantId: Joi.number().positive().required(),
});
