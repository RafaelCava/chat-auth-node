import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";
import { ConnectPostgresDatabaseValidation } from "@/validation/validators";

const makeSut = () => new ConnectPostgresDatabaseValidation();

describe("ConnectMongoDatabaseValidation", () => {
  it("should be defined", () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
  });

  it("should return an error if PostgresHelper is not connected", async () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).resolves.toThrow(
      new Error("Postgres database not connected"),
    );
  });

  it("should return an error if PostgresHelper is not connected 2", async () => {
    const sut = makeSut();
    jest.spyOn(PostgresHelper, "isConnected").mockResolvedValueOnce(false);
    const error = sut.validate({});
    expect(error).resolves.toThrow(
      new Error("Postgres database not connected"),
    );
  });

  it("should return null if PostgresHelper is connected", async () => {
    const sut = makeSut();
    jest.spyOn(PostgresHelper, "isConnected").mockResolvedValueOnce(true);
    const error = await sut.validate({});
    expect(error).toBe(undefined);
  });
});
