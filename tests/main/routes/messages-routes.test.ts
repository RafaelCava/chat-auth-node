import { faker } from "@faker-js/faker";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import MockDate from "mockdate";
import { Express } from "express";
import { Client } from "pg";
import request from "supertest";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import env from "@/main/config/env";
import { initPostgresSql } from "@/tests/infra/db/postgres/mocks/init-sql";
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";
import { setupApp } from "@/main/config/app";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";

describe("Messages Routes", () => {
  let app: Express;
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;
  const encrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer);
  jest.setTimeout(90000);

  const makeToken = async (id = faker.string.uuid()) => {
    const params = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    };
    const date = new Date();
    await postgresClient.query(
      'INSERT INTO "User" (id, email, name, password, "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)',
      [id, params.email, params.name, params.password, date, date],
    );
    const token = await encrypterAdapter.encrypt(id, "1d");
    return {
      token,
      params,
      id,
    };
  };

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    process.env.DATABASE_URL = postgresContainer.getConnectionUri();
    postgresClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await postgresClient.connect();
    await postgresClient.query(initPostgresSql);
    await PostgresHelper.connect();
    await MongoHelper.connect(env.mongoUrlTest);
    MockDate.set(new Date());
    app = await setupApp();
  });

  afterEach(async () => {
    await postgresClient.query('DELETE FROM "Room"');
    await postgresClient.query('DELETE FROM "User"');
    await MongoHelper.client.collection("messages").deleteMany({});
  });

  afterAll(async () => {
    await Promise.all([
      MongoHelper.disconnect(),
      PostgresHelper.disconnect(),
      postgresClient.end(),
    ]);
    await postgresContainer.stop();
    MockDate.reset();
  });

  describe("PATH /messages", () => {
    describe("POST", () => {
      it("Should return 403 if no token is provided", async () => {
        await request(app)
          .post("/api/messages")
          .expect(403)
          .expect({ error: "Access denied" });
      });

      it("Should return 403 if invalid token is provided", async () => {
        await request(app)
          .post("/api/messages")
          .set("x-access-token", "invalid_token")
          .expect(403)
          .expect({ error: "Access denied" });
      });

      it("Should return 400 if no content is provided", async () => {
        const { token } = await makeToken();
        await request(app)
          .post("/api/messages")
          .set("x-access-token", token)
          .expect(400)
          .expect({ error: "Missing param: content" });
      });

      it("Should return 400 if no roomId is provided", async () => {
        const { token } = await makeToken();
        await request(app)
          .post("/api/messages")
          .set("x-access-token", token)
          .send({
            content: faker.lorem.sentence(3),
          })
          .expect(400)
          .expect({ error: "Missing param: roomId" });
      });

      it("Should return 400 if content length is bigger than 500", async () => {
        const { token } = await makeToken();
        await request(app)
          .post("/api/messages")
          .set("x-access-token", token)
          .send({
            content: faker.lorem.sentence(500),
            roomId: faker.string.uuid(),
          })
          .expect(400)
          .expect({
            error: "The field content must have a maximum length of 500",
          });
      });

      it("Should return 201 on success", async () => {
        const { token, id } = await makeToken();
        const params = {
          content: faker.lorem.sentence(3),
          roomId: faker.string.uuid(),
        };
        await request(app)
          .post("/api/messages")
          .set("x-access-token", token)
          .send(params)
          .expect(201)
          .expect((data) => {
            expect(data.body).toEqual({
              content: params.content,
              ownerId: id,
              roomId: params.roomId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              id: expect.any(String),
              __v: 0,
            });
          });
      });
    });
  });
});
