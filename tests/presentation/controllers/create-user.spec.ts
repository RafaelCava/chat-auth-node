import { CreateUserController } from "@/presentation/controllers";
import { ValidationSpy } from "../mocks";
import { CreateUserUseCaseSpy } from "@/tests/domain/mocks";
import { faker } from "@faker-js/faker";

type SutTypes = {
  sut: CreateUserController;
  validationSpy: ValidationSpy;
  createUserUseCaseSpy: CreateUserUseCaseSpy;
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const createUserUseCaseSpy = new CreateUserUseCaseSpy()
  const sut = new CreateUserController(validationSpy, createUserUseCaseSpy)
  return {
    sut,
    validationSpy,
    createUserUseCaseSpy
  }
}

describe('Create User Controller', () => {
  it('should be defined', () => {
    const { sut, validationSpy, createUserUseCaseSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(validationSpy).toBeDefined();
    expect(createUserUseCaseSpy).toBeDefined();
  });

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.handle(request);
    expect(validationSpy.count).toBe(1);
    expect(validationSpy.params).toEqual(request);
  })
});