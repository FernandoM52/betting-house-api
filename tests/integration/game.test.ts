import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import { createGame, gameWithouAwayTeam, gameWithouHomeTeam } from '../factories/games-factory';

beforeAll(async () => {
  await init();
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
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when awayTeamName is empty', async () => {
      const body = gameWithouAwayTeam();
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is empty', async () => {
      const body = {
        homeTeamName: '',
        awayTeamName: '',
      };
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});

describe('POST /games/:id/finished', () => {
  describe('when params is valid', () => {
    it('should respond with status 201 and the updated game object', async () => {
      const game = await createGame();
      const body = {
        homeTeamScore: faker.number.int(),
        awayTeamScore: faker.number.int(),
      };

      const response = await server.get(`/games/${game.id}/finished`).send(body);

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
    for (let i = 0; i < 2; i++) {
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
});

describe('GET /games/:id', () => {
  describe('when params is valid', () => {
    it('should respond with status 200 and the game object', async () => {
      const game = await createGame();

      const { status, body } = await server.get(`/games/${game.id}`);

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        id: game.id,
        createdAt: game.updatedAt,
        updatedAt: game.createdAt,
        homeTeamName: game.homeTeamName,
        awayTeamName: game.awayTeamName,
        homeTeamScore: game.homeTeamScore,
        awayTeamScore: game.awayTeamScore,
        isFinished: game.isFinished,
        bets: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            homeTeamScore: expect.any(Number),
            awayTeamScore: expect.any(Number),
            amountBet: expect.any(Number),
            gameId: expect.any(Number),
            participantId: expect.any(Number),
            status: expect.any(String),
            amountWon: expect.any(Number) || null,
          }),
        ]),
      });
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
