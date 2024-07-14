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

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    process.env.DATABASE_URL = postgresContainer.getConnectionUri()
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(initPostgresSql);
    await client.end();
    await PostgresHelper.connect()
    MockDate.set(new Date())
    app = await setupApp()
  })

  afterAll(async () => {
    await PostgresHelper.disconnect()
    await postgresContainer.stop();
    MockDate.reset()
  })

  describe('POST /users', () => {
    it('Should return 200 on /users', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password()
        })
        .expect(201)
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
  })
})