import { faker } from "@faker-js/faker";
import { SendMessage } from "@/data/usecases/messages";
import { SendMessageUseCase } from "@/domain/usecases/messages";
import { CreateMessageRepositorySpy } from "../../mocks";

const makeSut = () => {
  const createMessageRepositorySpy = new CreateMessageRepositorySpy();
  const sut = new SendMessage(createMessageRepositorySpy);

  return {
    sut,
    createMessageRepositorySpy,
  };
};

const makeRequest = (): SendMessageUseCase.Params => ({
  content: faker.lorem.sentence(3),
  roomId: faker.string.uuid(),
  ownerId: faker.string.uuid(),
  createdAt: faker.date.recent(),
});

describe("SendMessageUseCase", () => {
  it("should be defined", () => {
    const { sut, createMessageRepositorySpy } = makeSut();
    expect(sut).toBeDefined();
    expect(createMessageRepositorySpy).toBeDefined();
  });

  describe("createMessageRepository", () => {
    it("should be called with correct params", async () => {
      const { sut, createMessageRepositorySpy } = makeSut();
      const params = makeRequest();
      await sut.send(params);
      expect(createMessageRepositorySpy.count).toBe(1);
      expect(createMessageRepositorySpy.params).toEqual(params);
    });

    it("Should throw if CreateMessageRepository throws", async () => {
      const { sut, createMessageRepositorySpy } = makeSut();
      createMessageRepositorySpy.returnError = true;
      const promise = sut.send(makeRequest());
      await expect(promise).rejects.toThrow(
        createMessageRepositorySpy.errorValue,
      );
    });

    it("Should return null if CreateMessageRepository returns null", async () => {
      const { sut, createMessageRepositorySpy } = makeSut();
      createMessageRepositorySpy.returnNull = true;
      const response = await sut.send(makeRequest());
      expect(response).toBeNull();
    });

    it("Should return a message on success", async () => {
      const { sut, createMessageRepositorySpy } = makeSut();
      const response = await sut.send(makeRequest());
      expect(response).toEqual(createMessageRepositorySpy.result);
    });
  });
});
