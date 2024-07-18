import { RefreshTokenController } from '@/presentation/controllers/authentication';
import { ValidationSpy } from '../mocks';
import { RefreshTokenUseCase } from '@/domain/usecases';
import { Spy } from '@/tests/shared/spy';
import { faker } from '@faker-js/faker';

class RefreshTokenUseCaseSpy implements RefreshTokenUseCase, Spy {
  params: RefreshTokenController.Request;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: RefreshTokenUseCase.Result = {
    accessToken: faker.string.alphanumeric(20),
    refreshToken: faker.string.alphanumeric(20)
  };
  async refreshToken (data: RefreshTokenUseCase.Params): Promise<RefreshTokenUseCase.Result> {
    this.count++;
    this.params = data;
    if (this.returnError) {
      throw this.errorValue;
    }
    if (this.returnNull) {
      return Promise.resolve(null);
    }
    return Promise.resolve(this.result);
  }
}

type SutTypes = {
  sut: RefreshTokenController
  validationSpy: ValidationSpy
  refreshTokenUseCaseSpy: RefreshTokenUseCaseSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const refreshTokenUseCaseSpy = new RefreshTokenUseCaseSpy();
  const sut = new RefreshTokenController(validationSpy, refreshTokenUseCaseSpy);
  
  return {
    sut,
    validationSpy,
    refreshTokenUseCaseSpy
  }
}

describe('RefreshToken Controller', () => {
  it('Should be defined', () => {
    const { sut, refreshTokenUseCaseSpy, validationSpy } = makeSut();
    expect(sut).toBeDefined();
    expect(refreshTokenUseCaseSpy).toBeDefined();
    expect(validationSpy).toBeDefined();
  })
})