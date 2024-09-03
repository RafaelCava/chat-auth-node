import MockDate from "mockdate";
import { PrismaClient } from "@prisma/client";
import { CreateRoomPostgresRepository } from "@/infra/db/postgres/repositories";
import { makeRoom } from "@/tests/domain/mocks";
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";

const makeSut = () => new CreateRoomPostgresRepository();

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    room: {
      create: jest.fn().mockResolvedValueOnce(makeRoom({})),
    },
  })),
}));

describe("CreateRoomPostgresRepository", () => {
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

  it("Should be able to create a room", async () => {
    const sut = makeSut();
    const room = await sut.create({
      name: "any_name",
      ownerId: "any_owner_id",
      description: "any_description",
      createdAt: new Date(),
      id: "any_id",
      updatedAt: new Date(),
    });

    expect(room).toBeTruthy();
    expect(room).toEqual({
      name: expect.any(String),
      ownerId: expect.any(String),
      description: expect.any(String),
      createdAt: new Date(),
      id: expect.any(String),
      updatedAt: new Date(),
    });
  });
});
