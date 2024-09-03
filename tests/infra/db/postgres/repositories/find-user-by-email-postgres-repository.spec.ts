import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { FindUserByEmailPostgresRepository } from "@/infra/db/postgres/repositories";
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn().mockResolvedValueOnce({ id: "any_id" }),
    },
  })),
}));

const makeSut = () => {
  const sut = new FindUserByEmailPostgresRepository();
  return {
    sut,
  };
};

describe("FindUserByEmailPostgresRepository", () => {
  let prismaMock: PrismaClient;

  beforeEach(() => {
    prismaMock = new PrismaClient();
    PostgresHelper.client = prismaMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should be defined", () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
  });

  it("Should call findFirst with correct params", async () => {
    const { sut } = makeSut();
    await sut.findByEmail({
      email: "any_email",
      projection: ["id", "password"],
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: "any_email",
      },
      select: {
        id: true,
        password: true,
      },
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it("Should call findFirst with correct params without projection", async () => {
    const { sut } = makeSut();
    const email = faker.internet.email();
    await sut.findByEmail({ email });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it("Should return null if no user is found", async () => {
    const { sut } = makeSut();
    prismaMock.user.findUnique = jest.fn().mockResolvedValueOnce(null);
    const user = await sut.findByEmail({ email: "any_email" });
    expect(user).toBeNull();
  });

  it("Should return user on success", async () => {
    const { sut } = makeSut();
    const email = faker.internet.email();
    const user = await sut.findByEmail({ email });
    expect(user).toEqual({ id: "any_id" });
  });
});
