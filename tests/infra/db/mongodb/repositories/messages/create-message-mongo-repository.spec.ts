import { faker } from "@faker-js/faker";
import { CreateMessageMongoRepository } from "@/infra/db/mongodb/repositories";
import { MessageModelSpy } from "../../mocks/models";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";

const makeSut = () => {
  const messageModelSpy = new MessageModelSpy();
  const sut = new CreateMessageMongoRepository(messageModelSpy as any);
  return {
    sut,
    messageModelSpy,
  };
};

const makeParams = () => ({
  content: faker.lorem.sentence(3),
  createdAt: faker.date.recent(),
  ownerId: faker.string.uuid(),
  roomId: faker.string.uuid(),
});

describe("CreateMessageMongoRepository", () => {
  it("Should be defined", async () => {
    const { messageModelSpy, sut } = makeSut();
    expect(sut).toBeDefined();
    expect(messageModelSpy).toBeDefined();
  });

  describe("create", () => {
    it("Should call create with correct values", async () => {
      const { messageModelSpy, sut } = makeSut();
      const params = makeParams();
      await sut.create(params);
      expect(messageModelSpy.count).toBe(1);
      expect(messageModelSpy.params).toEqual(params);
    });

    it("Should throw if messageModel.create throws", async () => {
      const { messageModelSpy, sut } = makeSut();
      messageModelSpy.returnError = true;
      await expect(sut.create(makeParams())).rejects.toThrow(
        messageModelSpy.errorValue,
      );
    });

    it("should return a created message on success", async () => {
      const { sut, messageModelSpy } = makeSut();
      const params = makeParams();
      const result = await sut.create(params);
      expect(result).toEqual(MongoHelper.map(messageModelSpy.result));
    });
  });
});
