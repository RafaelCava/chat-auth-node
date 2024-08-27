import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Express } from 'express';
import { Client } from 'pg';
import request from 'supertest'
import { setupApp } from '@/main/config/app';
import { initPostgresSql } from '@/tests/infra/db/postgres/mocks/init-sql';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper';
import MockDate from 'mockdate';
import { faker } from '@faker-js/faker';
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter';
import env from '@/main/config/env';


describe('Rooms Routes', () => {
  let app: Express
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;
  const encrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer)
  jest.setTimeout(30000)

  const makeToken = async () => {
    const params = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password()
    }
    const date = new Date()
    await postgresClient.query('INSERT INTO "User" (id, email, name, password, "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)', ['123123123', params.email, params.name, params.password, date, date])
    const token = await encrypterAdapter.encrypt('123123123', '1d')
    return {
      token,
      params
    }
  }

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    process.env.DATABASE_URL = postgresContainer.getConnectionUri()
    postgresClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await postgresClient.connect();
    await postgresClient.query(initPostgresSql);
    await PostgresHelper.connect()
    MockDate.set(new Date())
    app = await setupApp()
  })

  afterEach(async () => {
    await postgresClient.query('DELETE FROM "User"')
    await postgresClient.query('DELETE FROM "Room"')
  })

  afterAll(async () => {
    await PostgresHelper.disconnect()
    await postgresClient.end();
    await postgresContainer.stop();
    MockDate.reset()
  })

  describe('GET /rooms', () => {
    it('Should return 200 on success', async () => {
      await request(app)
        .get('/api/rooms?page=1&limit=10')
        .set('x-access-token', (await makeToken()).token)
        .expect(200)
        .expect([])
    })

    it('Should return 403 if no token is provided', async () => {
      await request(app)
        .get('/api/rooms?page=1&limit=10')
        .expect(403)
        .expect({ error: 'Access denied' })
    })
  })
})