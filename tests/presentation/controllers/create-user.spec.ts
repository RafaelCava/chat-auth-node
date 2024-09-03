import { CreateUserController } from "@/presentation/controllers";
import {
  badRequest,
  created,
  serverError,
} from "@/presentation/helpers/http-helper";
import {
  CreateUserUseCaseSpy,
  makeCreateUserControllerRequest,
} from "@/tests/domain/mocks";
import { ValidationSpy } from "../mocks";
import { UserExistsError } from "@/presentation/erros";

type SutTypes = {
  sut: CreateUserController;
  validationSpy: ValidationSpy;
  createUserUseCaseSpy: CreateUserUseCaseSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const createUserUseCaseSpy = new CreateUserUseCaseSpy();
  const sut = new CreateUserController(validationSpy, createUserUseCaseSpy);
  return {
    sut,
    validationSpy,
    createUserUseCaseSpy,
  };
};

describe("Create User Controller", () => {
  it("should be defined", () => {
    const { sut, validationSpy, createUserUseCaseSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(validationSpy).toBeDefined();
    expect(createUserUseCaseSpy).toBeDefined();
  });

  it("should call Validation with correct values", async () => {
    const { sut, validationSpy } = makeSut();
    const request = makeCreateUserControllerRequest();
    await sut.handle(request);
    expect(validationSpy.count).toBe(1);
    expect(validationSpy.params).toEqual(request);
  });

  it("should return 400 if Validation returns error", async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.returnError = true;
    const response = await sut.handle(makeCreateUserControllerRequest());
    expect(response).toEqual(badRequest(validationSpy.errorValue));
  });

  it("should return 500 if Validation throws", async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.throwsError = true;
    const response = await sut.handle(makeCreateUserControllerRequest());
    expect(response).toEqual(serverError(validationSpy.errorValue));
  });

  it("should call CreateUserUseCase with correct values", async () => {
    const { sut, createUserUseCaseSpy } = makeSut();
    const request = makeCreateUserControllerRequest();
    await sut.handle(request);
    expect(createUserUseCaseSpy.count).toBe(1);
    expect(createUserUseCaseSpy.params).toEqual(request);
  });

  it("should return 500 if CreateUserUseCase throws", async () => {
    const { sut, createUserUseCaseSpy } = makeSut();
    createUserUseCaseSpy.returnError = true;
    const response = await sut.handle(makeCreateUserControllerRequest());
    expect(response).toEqual(serverError(createUserUseCaseSpy.errorValue));
  });

  it("should return 201 if CreateUserUseCase returns a user", async () => {
    const { sut, createUserUseCaseSpy } = makeSut();
    const response = await sut.handle(makeCreateUserControllerRequest());
    expect(response).toEqual(created(createUserUseCaseSpy.result));
  });

  it("Should return 400 if CreateUserUseCase throws UserExistsError", async () => {
    const { sut, createUserUseCaseSpy } = makeSut();
    createUserUseCaseSpy.returnError = true;
    createUserUseCaseSpy.errorValue = new UserExistsError();
    const response = await sut.handle(makeCreateUserControllerRequest());
    expect(response).toEqual(badRequest(createUserUseCaseSpy.errorValue));
  });
});
