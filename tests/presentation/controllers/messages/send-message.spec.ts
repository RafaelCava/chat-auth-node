import { faker } from "@faker-js/faker";
import { SendMessageController } from "@/presentation/controllers/messages";
import { ValidationSpy } from "../../mocks";

const makeSut = () => {
  const validationSpy = new ValidationSpy();
  const sut = new SendMessageController(validationSpy);
  return {
    sut,
    validationSpy,
  };
};

const makeRequest = (): SendMessageController.Request => ({
  content: faker.lorem.sentence(3),
  room: faker.string.uuid(),
  userId: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
});

describe("Send Message Controller", () => {
  it("Should be defined", () => {
    const { sut, validationSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(validationSpy).toBeDefined();
  });

  describe("Validation", () => {
    it("Should be call validation with correct values", async () => {
      const { sut, validationSpy } = makeSut();
      const request = makeRequest();
      await sut.handle(request);
      expect(validationSpy.params).toEqual(request);
      expect(validationSpy.count).toBe(1);
    });
  });
});
