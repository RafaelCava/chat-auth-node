import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { ConnectMongoDatabaseValidation } from "@/validation/validators";

const makeSut = () => new ConnectMongoDatabaseValidation();

describe("ConnectMongoDatabaseValidation", () => {
  it("should be defined", () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
  });

  it("should return an error if MongoHelper is not connected", async () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).rejects.toThrow(new Error("Mongo database not connected"));
  });

  it("should return null if MongoHelper is connected", async () => {
    const sut = makeSut();
    jest.spyOn(MongoHelper, "isConnected").mockReturnValueOnce(true);
    const error = sut.validate({});
    expect(error).resolves.toBeNull();
  });
});
