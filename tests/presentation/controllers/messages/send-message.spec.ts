import { faker } from "@faker-js/faker";
import { SendMessageController } from "@/presentation/controllers/messages";
import { ValidationSpy } from "../../mocks";
import { badRequest, serverError } from "@/presentation/helpers/http-helper";
import { Spy } from "@/tests/shared/spy";
import { SendMessageUseCase } from "@/domain/usecases/messages";
import { Message } from "@/domain/entities";
import { makeMessage } from "@/tests/domain/mocks";

class SendMessageUseCaseSpy
  implements
    SendMessageUseCase,
    Spy<SendMessageUseCase.Params, SendMessageUseCase.Response>
{
  params: SendMessageUseCase.Params;

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence(3));

  result: Message = makeMessage({});

  async send(
    data: SendMessageUseCase.Params,
  ): Promise<SendMessageUseCase.Response> {
    ++this.count;
    this.params = data;
    if (this.returnError) {
      throw this.errorValue;
    }
    return await Promise.resolve(this.returnNull ? null : this.result);
  }
}

const makeSut = () => {
  const validationSpy = new ValidationSpy();
  const sendMessageUseCaseSpy = new SendMessageUseCaseSpy();
  const sut = new SendMessageController(validationSpy, sendMessageUseCaseSpy);
  return {
    sut,
    validationSpy,
    sendMessageUseCaseSpy,
  };
};

const makeRequest = (): SendMessageController.Request => ({
  content: faker.lorem.sentence(3),
  roomId: faker.string.uuid(),
  userId: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
});

describe("Send Message Controller", () => {
  it("Should be defined", () => {
    const { sut, validationSpy, sendMessageUseCaseSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(validationSpy).toBeDefined();
    expect(sendMessageUseCaseSpy).toBeDefined();
  });

  describe("Validation", () => {
    it("Should be call validation with correct values", async () => {
      const { sut, validationSpy } = makeSut();
      const request = makeRequest();
      await sut.handle(request);
      expect(validationSpy.params).toEqual(request);
      expect(validationSpy.count).toBe(1);
    });

    it("Should be return badRequest if validation fails", async () => {
      const { sut, validationSpy, sendMessageUseCaseSpy } = makeSut();
      validationSpy.returnError = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(badRequest(validationSpy.errorValue));
      expect(sendMessageUseCaseSpy.count).toBe(0);
    });

    it("Should be return serverError if validation throws", async () => {
      const { sut, validationSpy, sendMessageUseCaseSpy } = makeSut();
      validationSpy.throwsError = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(serverError(validationSpy.errorValue));
      expect(sendMessageUseCaseSpy.count).toBe(0);
    });
  });

  describe("SendMessageUseCase", () => {
    it("Should be call SendMessageUseCase with correct values", async () => {
      const { sut, sendMessageUseCaseSpy } = makeSut();
      const request = makeRequest();
      await sut.handle(request);
      expect(sendMessageUseCaseSpy.params).toEqual({
        ownerId: request.userId,
        content: request.content,
        roomId: request.roomId,
        createdAt: new Date(request.createdAt),
      });
      expect(sendMessageUseCaseSpy.count).toBe(1);
    });

    it("Should return serverError if SendMessageUseCase throws", async () => {
      const { sut, sendMessageUseCaseSpy } = makeSut();
      sendMessageUseCaseSpy.returnError = true;
      const response = await sut.handle(makeRequest());
      expect(response).toEqual(serverError(sendMessageUseCaseSpy.errorValue));
    });

    it("Should return created with message on success", async () => {
      const { sut, sendMessageUseCaseSpy } = makeSut();
      const response = await sut.handle(makeRequest());
      expect(response.body).toEqual(sendMessageUseCaseSpy.result);
    });
  });
});
