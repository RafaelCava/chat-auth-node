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

  const makeToken = async (id = faker.string.uuid()) => {
    const params = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password()
    }
    const date = new Date()
    await postgresClient.query('INSERT INTO "User" (id, email, name, password, "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)', [id, params.email, params.name, params.password, date, date])
    const token = await encrypterAdapter.encrypt(id, '1d')
    return {
      token,
      params,
      id
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

    it('Should return 200 with rooms in the limit and name filter', async () => {
      const authorization = await makeToken()
      const mockRooms = [makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id })]
      await PostgresHelper.client.room.createMany({
        data: mockRooms,
      })
      await request(app)
        .get(`/api/rooms?page=1&limit=2&name=${mockRooms[0].name.split(' ')[0]}`)
        .set('x-access-token', authorization.token)
        .expect(200)
        .expect([{...mockRooms[0], createdAt: mockRooms[0].createdAt.toISOString(), updatedAt: mockRooms[0].updatedAt.toISOString()}])
    })

    it('Should return 200 with rooms in the limit and ownerId filter', async () => {
      const authorization = await makeToken()
      const authorization2 = await makeToken()
      const mockRooms = [makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id })]
      await PostgresHelper.client.room.createMany({
        data: mockRooms,
      })
      await PostgresHelper.client.room.create({
        data: makeRoom({ ownerId: authorization2.id })
      })
      await request(app)
        .get(`/api/rooms?page=1&limit=10&ownerId=${authorization.id}`)
        .set('x-access-token', authorization.token)
        .expect(200)
        .expect((data) => {
          expect(data.body).toHaveLength(3)
        })
    })

    it('Should return 200 with rooms in the limit and ownerId filter - 2', async () => {
      const authorization = await makeToken()
      const authorization2 = await makeToken()
      const mockRooms = [makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id }), makeRoom({ ownerId: authorization.id })]
      await PostgresHelper.client.room.createMany({
        data: mockRooms,
      })
      await PostgresHelper.client.room.create({
        data: makeRoom({ ownerId: authorization2.id })
      })
      await request(app)
        .get(`/api/rooms?page=1&limit=10&ownerId=${authorization2.id}`)
        .set('x-access-token', authorization.token)
        .expect(200)
        .expect((data) => {
          expect(data.body).toHaveLength(1)
        })
    })
  })

  describe('POST /rooms', () => {
    it('Should return created room', async () => {
      const authorization = await makeToken()
      const mockRoom = makeRoom({ ownerId: authorization.id })
      await request(app)
        .post('/api/rooms')
        .send(mockRoom)
        .set('x-access-token', authorization.token)
        .expect(201)
        .expect((data) => {
          expect(data.body).toEqual({...mockRoom, id: expect.any(String), createdAt: expect.any(String), updatedAt: expect.any(String)})
        })
    })

    it('Should return 403 if no token is provided', async () => {
      await request(app)
        .post('/api/rooms')
        .expect(403)
        .expect({ error: 'Access denied' })
    })

    it('Should return 500 if invalid token is provided', async () => {
      await request(app)
        .post('/api/rooms')
        .set('x-access-token', 'invalid_token')
        .expect(500)
        .expect({ error: 'jwt malformed' })
    })
  })
})