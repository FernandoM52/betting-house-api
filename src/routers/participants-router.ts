import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { createParticipantSchema } from '@/schemas';
import { createParticipant, getAllParticipants } from '@/controllers';

const participantsRouter = Router();
participantsRouter.post('/', validateBody(createParticipantSchema), createParticipant);
participantsRouter.get('/', getAllParticipants);

export { participantsRouter };
