import supertest from 'supertest';
import httpStatus from 'http-status';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import { faker } from '@faker-js/faker';
import { prisma } from '@/config';
import {
  createParticipant,
  participantWithoutBalance,
  participantWithoutName,
} from '../factories/participants-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /participants', () => {
  describe('when body is valid', () => {
    const generateValidBody = () => ({
      name: faker.person.fullName(),
      balance: faker.number.int({ min: 10, max: 100000 }),
    });

    it('should respond with status 201 and create a participant', async () => {
      const valueConvert = 100;
      const body = generateValidBody();

      const response = await server.post('/participants').send(body);
      const participants = await prisma.participant.findMany({});

      expect(participants).toHaveLength(1);
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        name: body.name,
        balance: body.balance * valueConvert,
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
        balance: faker.number.int({ max: 9 }),
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

describe('GET /participants', () => {
  it('should respond with status 200 and a array of participants', async () => {
    for (let i = 0; i < 2; i++) {
      await createParticipant();
    }

    const { status, body } = await server.get('/participants');
    const participants = await prisma.participant.findMany({});

    expect(participants).toHaveLength(3);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          balance: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});
