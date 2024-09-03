import { faker } from "@faker-js/faker";
import { ValidationSpy } from "../mocks";
import { ShowProfileController } from "@/presentation/controllers";
import {
  badRequest,
  ok,
  serverError,
} from "@/presentation/helpers/http-helper";
import { ShowProfileUseCaseSpy } from "@/tests/domain/mocks";

const makeSut = () => {
  const validationSpy = new ValidationSpy();
  const showProfileSpy = new ShowProfileUseCaseSpy();
  const sut = new ShowProfileController(validationSpy, showProfileSpy);

  return {
    sut,
    showProfileSpy,
    validationSpy,
  };
};

describe("ShowProfileController", () => {
  it("Should be defined", () => {
    const { showProfileSpy, sut, validationSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(showProfileSpy).toBeDefined();
    expect(validationSpy).toBeDefined();
  });

  describe("Validation", () => {
    it("Should call validation with correct values", async () => {
      const { sut, validationSpy } = makeSut();
      const request = { userId: faker.string.uuid() };
      await sut.handle(request);
      expect(validationSpy.params).toEqual(request);
      expect(validationSpy.count).toBe(1);
    });

    it("Should return badRequest if validation fails", async () => {
      const { sut, validationSpy, showProfileSpy } = makeSut();
      validationSpy.returnError = true;
      const response = await sut.handle({ userId: faker.string.uuid() });
      expect(response).toEqual(badRequest(validationSpy.errorValue));
      expect(showProfileSpy.count).toBe(0);
    });

    it("Should return serverError if validation returns an error", async () => {
      const { sut, validationSpy, showProfileSpy } = makeSut();
      validationSpy.throwsError = true;
      const response = await sut.handle({ userId: faker.string.uuid() });
      expect(response).toEqual(serverError(validationSpy.errorValue));
      expect(showProfileSpy.count).toBe(0);
    });
  });

  describe("ShowProfileUseCase", () => {
    it("Should call ShowProfileUseCase with correct values", async () => {
      const { sut, showProfileSpy } = makeSut();
      const request = { userId: faker.string.uuid() };
      await sut.handle(request);
      expect(showProfileSpy.params).toEqual(request.userId);
      expect(showProfileSpy.count).toBe(1);
    });

    it("Should return serverError if ShowProfileUseCase throws an error", async () => {
      const { sut, showProfileSpy } = makeSut();
      showProfileSpy.returnError = true;
      const response = await sut.handle({ userId: faker.string.uuid() });
      expect(response).toEqual(serverError(showProfileSpy.errorValue));
    });

    it("Should return ok with user data without password", async () => {
      const { sut, showProfileSpy } = makeSut();
      const response = await sut.handle({ userId: faker.string.uuid() });
      expect(response).toEqual(ok(showProfileSpy.result));
    });
  });
});
