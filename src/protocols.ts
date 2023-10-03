export type ApplicationError = {
  name: string;
  message: string;
};

export type ParticipantBody = {
  name: string;
  balance: number;
};

export type CreateGameBody = {
  homeTeamName: string;
  awayTeamName: string;
};

export type FinishGameBody = {
  homeTeamScore: number;
  awayTeamScore: number;
};

export type CreateBetBody = {
  homeTeamScore: number;
  awayTeamScore: number;
  amountBet: number;
  gameId: number;
  participantId: number;
};
