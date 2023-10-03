import { ApplicationError } from '@/protocols';

export function minBalanceError(): ApplicationError {
  return {
    name: 'MinBalanceError',
    message: 'Minimum initial balance is R$10',
  };
}
