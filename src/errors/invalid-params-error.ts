import { ApplicationError } from '@/protocols';

export function invalidParamsError(): ApplicationError {
  return {
    name: 'InvalidParamsError',
    message: 'Invalid route parameter',
  };
}
