import { ApplicationError } from '@/protocols';

export function unauthorizedError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'You must be a participant to bet',
  };
}
