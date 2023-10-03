import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import { participantWithoutBalance, participantWithoutName } from '../factories/participants-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /participants', () => {
  describe('when body is valid', () => {
    const generateValidBody = () => ({
      name: faker.person.fullName(),
      balance: faker.number.int({ min: 1000 }),
    });

    it('should create a participant and respond with status 201', async () => {
      const body = generateValidBody();
      const response = await server.post('/participants').send(body);

      const participant = await prisma.participant.findUnique({
        where: { id: response.body.id },
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: participant.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: body.name,
        balance: body.balance,
      });
    });
  });

  describe('when body is invalid', () => {
    it('should respond with status 400 when name is empty', async () => {
      const body = participantWithoutName();
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when balance is empty', async () => {
      const body = participantWithoutBalance();
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when balance is lower then R$10,00', async () => {
      const body = {
        name: faker.person.fullName(),
        balance: faker.number.int({ max: 999 }),
      };
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is empty', async () => {
      const body = {
        name: '',
        balance: '',
      };
      const { status } = await server.post('/participants').send(body);

      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});
