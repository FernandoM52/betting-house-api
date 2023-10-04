import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import { createFinishedGame, createGame, gameWithouAwayTeam, gameWithouHomeTeam } from '../factories/games-factory';
import { createParticipant } from '../factories/participants-factory';
import { createBet } from '../factories/bets-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /games', () => {
  describe('when body is valid', () => {
    const generateValidBody = () => ({
      homeTeamName: faker.lorem.word(),
      awayTeamName: faker.lorem.word(),
    });

    it('should respond with status 201 ant create a game', async () => {
      const body = generateValidBody();
      const response = await server.post('/games').send(body);

      const games = await prisma.game.findMany({});

      expect(games).toHaveLength(1);
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        homeTeamName: body.homeTeamName,
        awayTeamName: body.awayTeamName,
        homeTeamScore: 0,
        awayTeamScore: 0,
        isFinished: false,
      });
    });
  });

  describe('when body is invalid', () => {
    it('should respond with status 400 when homeTeamName is empty', async () => {
      const body = gameWithouHomeTeam();
      const { status } = await server.post('/games').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when awayTeamName is empty', async () => {
      const body = gameWithouAwayTeam();
      const { status } = await server.post('/games').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is empty', async () => {
      const body = {
        homeTeamName: '',
        awayTeamName: '',
      };
      const { status } = await server.post('/games').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});

describe('POST /games/:id/finished', () => {
  describe('when params is valid', () => {
    it('should respond with status 201 and the updated game object', async () => {
      const game = await createGame();
      const body = {
        homeTeamScore: faker.number.int({ min: 0, max: 10 }),
        awayTeamScore: faker.number.int({ min: 0, max: 10 }),
      };

      const response = await server.post(`/games/${game.id}/finish`).send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: game.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        homeTeamName: game.homeTeamName,
        awayTeamName: game.awayTeamName,
        homeTeamScore: body.homeTeamScore,
        awayTeamScore: body.awayTeamScore,
        isFinished: true,
      });
    });

    it('should respond with status 204 when game already finished', async () => {
      const game = await createFinishedGame();
      const body = {
        homeTeamScore: faker.number.int({ min: 0, max: 10 }),
        awayTeamScore: faker.number.int({ min: 0, max: 10 }),
      };

      const response = await server.post(`/games/${game.id}/finish`).send(body);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('when params is invalid', () => {
    it('should respond with status 404 when id do not exist', async () => {
      const fakeId = faker.number.int({ min: 10000, max: 20000 });
      const { status } = await server.get(`/games/${fakeId}`);

      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 400 when id is NaN', async () => {
      const fakeId = faker.lorem.word();
      const { status } = await server.get(`/games/${fakeId}`);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when id is negative', async () => {
      const negativeId = -1;
      const { status } = await server.get(`/games/${negativeId}`);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});

describe('GET /games', () => {
  it('should respond with status 200 and a array of games', async () => {
    for (let i = 0; i < 3; i++) {
      await createGame();
    }

    const { status, body } = await server.get('/games');
    const games = await prisma.game.findMany({});

    expect(games).toHaveLength(3);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          homeTeamName: expect.any(String),
          awayTeamName: expect.any(String),
          homeTeamScore: expect.any(Number),
          awayTeamScore: expect.any(Number),
          isFinished: expect.any(Boolean),
        }),
      ]),
    );
  });

  it('should respond with status 200 and a empty array when does not have games', async () => {
    const { status, body } = await server.get('/games');
    const games = await prisma.game.findMany({});

    expect(games).toHaveLength(0);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual([]);
  });
});

describe('GET /games/:id', () => {
  describe('when params is valid', () => {
    it('should respond with status 200 and the game object', async () => {
      const participant = await createParticipant();
      const game = await createGame();
      const bet = await createBet(game.id, participant.id);

      const { status, body } = await server.get(`/games/${game.id}`);

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        id: game.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        homeTeamName: game.homeTeamName,
        awayTeamName: game.awayTeamName,
        homeTeamScore: game.homeTeamScore,
        awayTeamScore: game.awayTeamScore,
        isFinished: game.isFinished,
        bets: expect.arrayContaining([
          expect.objectContaining({
            id: bet.id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamScore: bet.homeTeamScore,
            awayTeamScore: bet.awayTeamScore,
            amountBet: bet.amountBet,
            gameId: bet.gameId,
            participantId: bet.participantId,
            status: bet.status,
            amountWon: bet.amountWon,
          }),
        ]),
      });
    });

    it('should responde with status 200 and the game object with empty array for property bets when game does not have bets', async () => {
      const game = await createGame();

      const { status, body } = await server.get(`/games/${game.id}`);

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        id: game.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        homeTeamName: game.homeTeamName,
        awayTeamName: game.awayTeamName,
        homeTeamScore: expect.any(Number),
        awayTeamScore: expect.any(Number),
        isFinished: game.isFinished,
        bets: [],
      });
    });
  });

  describe('when params is invalid', () => {
    it('should respond with status 404 when id do not exist', async () => {
      const fakeId = faker.number.int({ min: 1000, max: 2000 });
      const { status } = await server.get(`/games/${fakeId}`);

      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 400 when id is NaN', async () => {
      const fakeId = faker.lorem.word();
      const { status } = await server.get(`/games/${fakeId}`);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when id is negative', async () => {
      const negativeId = -1;
      const { status } = await server.get(`/games/${negativeId}`);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});
