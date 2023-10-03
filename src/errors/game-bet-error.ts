import { ApplicationError } from '@/protocols';

export function gameBetError(): ApplicationError {
  return {
    name: 'GameBetError',
    message: 'The bet was not placed because the game in question does not exist or has already been finished',
  };
}
