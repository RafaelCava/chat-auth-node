import MockDate from "mockdate";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { CreateUserPostgresRepository } from "@/infra/db/postgres/repositories";
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";
import { User } from "@/domain/entities";

const makeSut = () => new CreateUserPostgresRepository();

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn().mockResolvedValueOnce({
        id: "any_id",
        email: "any_email",
        name: "any_name",
        password: "any_password",
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      }),
    },
  })),
}));

describe("CreateUserPostgresRepository", () => {
  let prismaMock: PrismaClient;

  beforeEach(() => {
    MockDate.set(new Date());
    prismaMock = new PrismaClient();
    PostgresHelper.client = prismaMock;
  });

  afterEach(() => {
    MockDate.reset();
    jest.clearAllMocks();
  });

  it("Should be defined", () => {
    expect(makeSut()).toBeDefined();
  });

  it("Should call create with correct params", async () => {
    const sut = makeSut();
    const params = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    };
    const makeUser = new User(params);
    await sut.create(makeUser);
    expect(PostgresHelper.client.user.create).toHaveBeenCalledWith({
      data: {
        ...makeUser,
        id: expect.any(String),
      },
    });
    expect(PostgresHelper.client.user.create).toHaveBeenCalledTimes(1);
  });

  it("Should return a user on success", async () => {
    const sut = makeSut();
    const params = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    };
    const makeUser = new User(params);
    const user = await sut.create(makeUser);
    expect(user).toEqual({
      id: "any_id",
      email: "any_email",
      name: "any_name",
      password: "any_password",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });
  });
});
