import { Express } from 'express';
import MockDate from 'mockdate';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper'
import request from 'supertest'
import { setupApp } from '@/main/config/app';
import { faker } from '@faker-js/faker';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { initPostgresSql } from '@/tests/infra/db/postgres/mocks/init-sql';
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter';
import env from '@/main/config/env';


describe('Users Routes', () => {
  let app: Express
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;
  const encrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer)

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
  })

  afterAll(async () => {
    await PostgresHelper.disconnect()
    await postgresClient.end();
    await postgresContainer.stop();
    MockDate.reset()
  })

  describe('POST /users', () => {
    it('Should return 200 on /users', async () => {
      const params = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password()
      } 
      await request(app)
        .post('/api/users')
        .send(params)
        .expect(201)
        .expect((data) => {
          expect(data.body).toHaveProperty('id')
          expect(data.body.id).not.toBeNull()
          expect(data.body).toHaveProperty('email', params.email)
          expect(data.body).toHaveProperty('name', params.name)
          expect(data.body).toHaveProperty('createdAt', new Date().toISOString())
          expect(data.body).toHaveProperty('updatedAt', new Date().toISOString())
        })
    })
  
    it('Should return 400 if no email is provided', async () => {
      await request(app)
        .post('/api/users')
        .send({
          name: faker.person.fullName(),
          password: faker.internet.password()
        })
        .expect(400)
        .expect({ error: 'Missing param: email' })
    })
  
    it('Should return 400 if no name is provided', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password()
        })
        .expect(400)
        .expect({ error: 'Missing param: name' })
    })
  
    it('Should return 400 if no password is provided', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: faker.internet.email(),
          name: faker.person.fullName()
        })
        .expect(400)
        .expect({ error: 'Missing param: password' })
    })
  
    it('Should return 400 if invalid email is provided', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: faker.lorem.sentence(),
          name: faker.person.fullName(),
          password: faker.internet.password()
        })
        .expect(400)
        .expect({ error: 'Invalid param: email' })
    })
  
    it('Should return 500 if usecase throw some error', async () => {
      jest.spyOn(PostgresHelper.client.user, 'create').mockRejectedValueOnce(new Error())
      await request(app)
        .post('/api/users')
        .send({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password()
        })
        .expect(500)
    })

    it('Should return 500 if user already exists', async () => {
      const params = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password()
      }
      await postgresClient.query('INSERT INTO "User" (id, email, name, password, "updatedAt") VALUES ($1, $2, $3, $4, $5)', ['123123123', params.email, params.name, params.password, new Date()])
      await request(app)
        .post('/api/users')
        .send(params)
        .expect(400)
        .expect({ error: 'User already exists' })
    })
  })

  describe('GET /users', () => {
    it('Should return 200 on /users', async () => {
      const params = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password()
      }
      
      const date = new Date()
      await postgresClient.query('INSERT INTO "User" (id, email, name, password, "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)', ['123123123', params.email, params.name, params.password, date, date])
      const accessToken = await encrypterAdapter.encrypt('123123123', '1d')

      await request(app)
        .get('/api/users?page=1&limit=10')
        .set('x-access-token', accessToken)
        .expect(200)
        .expect((data) => {
          expect(data.body).toHaveLength(1)
          expect(data.body[0]).toHaveProperty('id', '123123123')
          expect(data.body[0]).toHaveProperty('email', params.email)
          expect(data.body[0]).toHaveProperty('name', params.name)
          expect(data.body[0]).toHaveProperty('createdAt')
          expect(data.body[0]).toHaveProperty('updatedAt')
          expect(data.body[0]).not.toHaveProperty('password')
        })
    })

    it('Should return 200 on /users with empty array', async () => {
      const { token: accessToken } = await makeToken()
      await request(app)
        .get('/api/users?page=1&limit=10')
        .set('x-access-token', accessToken)
        .expect(200)
        .expect((data) => {
          expect(data.body).toHaveLength(1)
        })
    })

    it('Should return 500 if usecase throw some error', async () => {
      jest.spyOn(PostgresHelper.client.user, 'findMany').mockRejectedValueOnce(new Error())
      const { token: accessToken } = await makeToken()

      await request(app)
        .get('/api/users?page=1&limit=10')
        .set('x-access-token', accessToken)
        .expect(500)
    })

    it('Should return badRequest if page not provided', async () => {
      const { token: accessToken } = await makeToken()

      await request(app)
        .get('/api/users?limit=10')
        .set('x-access-token', accessToken)
        .expect(400)
        .expect({ error: 'Missing param: page' })
    })

    it('Should return badRequest if limit not provided', async () => {
      const { token: accessToken } = await makeToken()

      await request(app)
        .get('/api/users?page=10')
        .set('x-access-token', accessToken)
        .expect(400)
        .expect({ error: 'Missing param: limit' })
    })

    it('Should return badRequest if page is not a number', async () => {
      const { token: accessToken } = await makeToken()

      await request(app)
        .get('/api/users?page=abc&limit=10')
        .set('x-access-token', accessToken)
        .expect(400)
        .expect({ error: 'Invalid param: page' })
    })

    it('Should return badRequest if limit is not a number', async () => {
      const { token: accessToken } = await makeToken()

      await request(app)
        .get('/api/users?page=1&limit=abc')
        .set('x-access-token', accessToken)
        .expect(400)
        .expect({ error: 'Invalid param: limit' })
    })
  })
})