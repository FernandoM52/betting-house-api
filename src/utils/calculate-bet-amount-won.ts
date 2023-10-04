import { Bet } from '@prisma/client';

export async function calculateBetAmountWon(bet: Bet, winningAmount: number, totalAmount: number) {
  const houseFee = 1 - 0.3;

  const result = (bet.amountBet / winningAmount) * totalAmount * houseFee;
  return result;
}
