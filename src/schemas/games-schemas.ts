import Joi from 'joi';
import { CreateGameBody, FinishGameBody } from '@/protocols';

export const createGameSchema = Joi.object<CreateGameBody>({
  homeTeamName: Joi.string().trim().required(),
  awayTeamName: Joi.string().trim().required(),
});

export const finishGameSchema = Joi.object<FinishGameBody>({
  homeTeamScore: Joi.number().min(0).required(),
  awayTeamScore: Joi.number().min(0).required(),
});
