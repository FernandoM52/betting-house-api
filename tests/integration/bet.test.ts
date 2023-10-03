import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import { createParticipant } from '../factories/participants-factory';
import { createGame } from '../factories/games-factory';
import { buildBetReturn } from '../factories/bets-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /bets', () => {
  describe('when body is valid', () => {
    const valueConvert = 100;
    const generateValidBody = (gameId: number, participantId: number) => ({
      gameId,
      participantId,
      homeTeamScore: faker.number.int({ min: 0 }),
      awayTeamScore: faker.number.int({ min: 0 }),
      amountBet: faker.number.int({ min: 2, max: 10 }) * valueConvert,
    });

    it('should respond with status 201 and create a bet', async () => {
      const participant = await createParticipant();
      const game = await createGame();
      const body = generateValidBody(game.id, participant.id);

      const response = await server.post('/bets').send(body);
      const bets = await prisma.bet.findMany({});

      expect(bets).toHaveLength(1);
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        homeTeamScore: body.homeTeamScore,
        awayTeamScore: body.awayTeamScore,
        amountBet: body.amountBet,
        gameId: game.id,
        participantId: participant.id,
        status: 'PENDING',
        amountWon: null,
      });
    });
  });

  describe('when body is invalid', () => {
    it('should respond with status 400 when homeTeamScore is empty', async () => {
      const body = buildBetReturn('homeTeamScore');
      console.log(body);
      const { status } = await server.post('/bets').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when awayTeamScore is empty', async () => {
      const body = buildBetReturn('awayTeamScore');
      const { status } = await server.post('/bets').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when amountBet is empty', async () => {
      const body = buildBetReturn('amountBet');
      const { status } = await server.post('/bets').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when gameId is empty', async () => {
      const body = buildBetReturn('gameId');
      const { status } = await server.post('/bets').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when participantId is empty', async () => {
      const body = buildBetReturn('participantId');
      const { status } = await server.post('/bets').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is empty', async () => {
      const body = {
        gameId: '',
        participantId: '',
        homeTeamScore: '',
        awayTeamScore: '',
        amountBet: '',
      };
      const { status } = await server.post('/bets').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});
