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
import { makeRoom } from '@/tests/domain/mocks';


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
      params,
      id: '123123123'
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
    await postgresClient.query('DELETE FROM "Room"')
    await postgresClient.query('DELETE FROM "User"')
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

    it('Should return 500 if invalid token is provided', async () => {
      await request(app)
        .get('/api/rooms?page=1&limit=10')
        .set('x-access-token', 'invalid_token')
        .expect(500)
        .expect({ error: 'jwt malformed' })
    })

    it('Should return 400 if invalid query params are provided - limit', async () => {
      await request(app)
        .get('/api/rooms?page=invalid&limit=invalid')
        .set('x-access-token', (await makeToken()).token)
        .expect(400)
        .expect({ error: 'Invalid param: limit' })
    })

    it('Should return 400 if invalid query params are provided - page', async () => {
      await request(app)
        .get('/api/rooms?page=invalid&limit=10')
        .set('x-access-token', (await makeToken()).token)
        .expect(400)
        .expect({ error: 'Invalid param: page' })
    })

    it('Should return 400 if no query params are provided - page', async () => {
      await request(app)
        .get('/api/rooms?limit=10')
        .set('x-access-token', (await makeToken()).token)
        .expect(400)
        .expect({ error: 'Missing param: page' })
    })

    it('Should return 400 if no query params are provided - limit', async () => {
      await request(app)
        .get('/api/rooms?page=10')
        .set('x-access-token', (await makeToken()).token)
        .expect(400)
        .expect({ error: 'Missing param: limit' })
    })

    it('Should return 200 with rooms', async () => {
      const authorization = await makeToken()
      const mockRoom = makeRoom({ ownerId: authorization.id })
      const databaseRoom = await PostgresHelper.client.room.create({
        data: mockRoom
      })
      await request(app)
        .get('/api/rooms?page=1&limit=10')
        .set('x-access-token', authorization.token)
        .expect(200)
        .expect([{...databaseRoom, createdAt: databaseRoom.createdAt.toISOString(), updatedAt: databaseRoom.updatedAt.toISOString()}])
    })

    it('Should return 200 with rooms in the limit', async () => {
      const authorization = await makeToken()
      const mockRooms = [makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id })]
      await PostgresHelper.client.room.createMany({
        data: mockRooms,
      })
      await request(app)
        .get('/api/rooms?page=1&limit=2')
        .set('x-access-token', authorization.token)
        .expect(200)
        .expect((data) => {
          expect(data.body).toHaveLength(2)
        })
    })

    it('Should return 200 with rooms in the limit', async () => {
      const authorization = await makeToken()
      const mockRooms = [makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id })]
      await PostgresHelper.client.room.createMany({
        data: mockRooms,
      })
      await request(app)
        .get('/api/rooms?page=1&limit=2')
        .set('x-access-token', authorization.token)
        .expect(200)
        .expect((data) => {
          expect(data.body).toHaveLength(2)
        })
    })
  })
})