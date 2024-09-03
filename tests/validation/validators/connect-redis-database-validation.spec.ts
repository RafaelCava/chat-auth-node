import { RedisHelper } from "@/infra/db/redis/helpers/redis-helper";
import { ConnectRedisDatabaseValidation } from "@/validation/validators";

const makeSut = () => new ConnectRedisDatabaseValidation();

describe("ConnectMongoDatabaseValidation", () => {
  it("should be defined", () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
  });

  it("should return an error if RedisHelper is not connected", async () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).resolves.toThrow(new Error("Redis database not connected"));
  });

  it("should return an error if RedisHelper is not connected 2", async () => {
    const sut = makeSut();
    jest.spyOn(RedisHelper, "isConnected").mockResolvedValueOnce(false);
    const error = sut.validate({});
    expect(error).resolves.toThrow(new Error("Redis database not connected"));
  });

  it("should return an error if RedisHelper is not connected 3", async () => {
    const sut = makeSut();
    jest
      .spyOn(RedisHelper, "isConnected")
      .mockRejectedValueOnce(new Error("Redis database not connected"));
    const error = sut.validate({});
    expect(error).resolves.toThrow(new Error("Redis database not connected"));
  });

  it("should return null if RedisHelper is connected", async () => {
    const sut = makeSut();
    jest.spyOn(RedisHelper, "isConnected").mockResolvedValueOnce(true);
    const error = await sut.validate({});
    expect(error).toBe(undefined);
  });
});
