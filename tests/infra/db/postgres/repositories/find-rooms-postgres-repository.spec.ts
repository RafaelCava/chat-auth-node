import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { FindRoomsPostgresRepository } from "@/infra/db/postgres/repositories";
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";

const makeSut = () => new FindRoomsPostgresRepository();

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    room: {
      findMany: jest.fn().mockResolvedValue([{ id: "any_id" }]),
    },
  })),
}));

describe("FindRoomsPostgresRepository", () => {
  let prismaMock: PrismaClient;

  beforeEach(() => {
    prismaMock = new PrismaClient();
    PostgresHelper.client = prismaMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should be defined", () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
  });

  it("Should call findMany with correct params", async () => {
    const sut = makeSut();
    const params = {
      limit: 10,
      page: 1,
      projection: ["id"] as any,
      filters: { ownerId: faker.string.uuid() },
    };
    const findManySpy = jest.spyOn(PostgresHelper.client.room, "findMany");
    await sut.find(params);
    expect(findManySpy).toHaveBeenCalledWith({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      select: PostgresHelper.formateProjection(params.projection),
      where: params.filters,
    });
  });

  it("Should call findMany with correct params - name", async () => {
    const sut = makeSut();
    const params = {
      limit: 10,
      page: 1,
      projection: ["id"] as any,
      filters: { name: faker.person.fullName() },
    };
    const findManySpy = jest.spyOn(PostgresHelper.client.room, "findMany");
    await sut.find(params);
    expect(findManySpy).toHaveBeenCalledWith({
      take: params.limit,
      skip: (params.page - 1) * params.limit,
      select: PostgresHelper.formateProjection(params.projection),
      where: { ...params.filters, name: { contains: params.filters.name } },
    });
  });

  it("Should return an array of rooms", async () => {
    const sut = makeSut();
    const params = { limit: 10, page: 1, projection: ["id"] as any };
    const rooms = await sut.find(params);
    expect(rooms).toEqual([{ id: "any_id" }]);
  });

  it("Should return an empty array if no rooms are found", async () => {
    const sut = makeSut();
    const params = { limit: 10, page: 1, projection: ["id"] as any };
    jest
      .spyOn(PostgresHelper.client.room, "findMany")
      .mockResolvedValueOnce([]);
    const rooms = await sut.find(params);
    expect(rooms).toEqual([]);
  });

  it("Should throw if findMany throws", async () => {
    const sut = makeSut();
    const params = { limit: 10, page: 1, projection: ["id"] as any };
    jest
      .spyOn(PostgresHelper.client.room, "findMany")
      .mockRejectedValueOnce(new Error("FindManyError"));
    const promise = sut.find(params);
    await expect(promise).rejects.toThrow(new Error("FindManyError"));
  });
});
