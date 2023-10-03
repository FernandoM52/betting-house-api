import { ApplicationError } from '@/protocols';

export function insufficientBalanceError(): ApplicationError {
  return {
    name: 'InsufficientBalanceError',
    message: 'The bet amount is greater than the available balance',
  };
}
