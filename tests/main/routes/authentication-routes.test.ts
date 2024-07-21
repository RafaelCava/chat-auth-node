import MockDate from 'mockdate';
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";
import { initPostgresSql } from "@/tests/infra/db/postgres/mocks/init-sql";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Express } from "express";
import { Client } from "pg";
import { setupApp } from '@/main/config/app';
import { User } from '@/domain/entities';
import { BcryptAdapter } from '@/infra/criptography/bcrypt/bcrypt-adapter';
import env from '@/main/config/env';
import { faker } from '@faker-js/faker';
import request from 'supertest';


describe('Authentication Routes', () => {
  let app: Express
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;
  jest.setTimeout(30000)

  const makeUserPostgres = async (user: User) => {
    const hasherAdapter = new BcryptAdapter(env.saltHasher)
    const hashPassword = await hasherAdapter.hash(user.password)
    const userRow = await postgresClient.query(`INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") VALUES ('${user.id}', '${user.email}', '${user.name}', '${hashPassword}', '${user.createdAt.toISOString()}', '${user.updatedAt.toISOString()}')`)
    return userRow
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

  describe('/Auth route', () => {
    describe('POST /login', () => {
      it('Should return 200 on /login with token', async () => {
        const id = faker.string.uuid()
        const user = new User({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password()
        }, id)
        await makeUserPostgres(user)
        await request(app)
          .post('/api/auth/login')
          .send({
            email: user.email,
            password: user.password
          })
          .expect(200)
          .expect((data) => {
            expect(data.body).toHaveProperty('accessToken')
            expect(data.body).toHaveProperty('refreshToken')
          })
      })
      it('Should return 401 on /login with invalid credentials', async () => {
        const id = faker.string.uuid()
        const user = new User({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password()
        }, id)
        await makeUserPostgres(user)
        await request(app)
          .post('/api/auth/login')
          .send({
            email: user.email,
            password: faker.internet.password()
          })
          .expect(401)
          .expect((data) => {
            expect(data.body).toHaveProperty('error')
            expect(data.body.error).toBe('Access denied')
          })
      })

      it('Should return 401 on /login if user not exists', async () => {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: faker.internet.email(),
            password: faker.internet.password()
          })
          .expect(401)
          .expect((data) => {
            expect(data.body).toHaveProperty('error')
            expect(data.body.error).toBe('User not exists')
          })
      })

      it('Should return 400 on /login if email is invalid', async () => {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: faker.lorem.word(),
            password: faker.internet.password()
          })
          .expect(400)
          .expect((data) => {
            expect(data.body).toHaveProperty('error')
            expect(data.body.error).toBe('Invalid param: email')
          })
      })

      it('Should return 400 on /login if no email is provided', async () => {
        await request(app)
          .post('/api/auth/login')
          .send({
            password: faker.internet.password()
          })
          .expect(400)
          .expect((data) => {
            expect(data.body).toHaveProperty('error')
            expect(data.body.error).toBe('Missing param: email')
          })
      })

      it('Should return 400 if no password is provided', async () => {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: faker.internet.email()
          })
          .expect(400)
          .expect((data) => {
            expect(data.body).toHaveProperty('error')
            expect(data.body.error).toBe('Missing param: password')
          })
      })

      it('Should return 500 if some error occurs', async () => {
        jest.spyOn(PostgresHelper.client.user, 'findUnique').mockImplementationOnce(() => { throw new Error('Some error') })
        await request(app)
          .post('/api/auth/login')
          .send({
            email: faker.internet.email(),
            password: faker.internet.password()
          })
          .expect(500)
          .expect((data) => {
            expect(data.body).toHaveProperty('error')
            expect(data.body.error).toBe('Some error')
          })
      })
    })
  })
})