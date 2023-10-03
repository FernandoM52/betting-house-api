import { ApplicationError } from '@/protocols';

export function gameAlreadyFinishedError(): ApplicationError {
  return {
    name: 'GameAlreadyFinishedError',
    message: 'This game has already been finished',
  };
}
