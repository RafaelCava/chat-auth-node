import { Express } from 'express';
import MockDate from 'mockdate';
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper'
import request from 'supertest'
import { setupApp } from '@/main/config/app';
import { faker } from '@faker-js/faker';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { initPostgresSql } from '@/tests/infra/db/postgres/mocks/init-sql';


describe('Users Routes', () => {
  let app: Express
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;

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
})