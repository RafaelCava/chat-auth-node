import { RefreshTokenController } from '@/presentation/controllers/authentication';
import { ValidationSpy } from '../mocks';
import { RefreshTokenUseCase } from '@/domain/usecases';
import { Spy } from '@/tests/shared/spy';
import { faker } from '@faker-js/faker';
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper';

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

  it('Should return badRequest if validation returns error', async () => {
    const { sut, validationSpy, refreshTokenUseCaseSpy } = makeSut();
    validationSpy.returnError = true;
    const result = await sut.handle({ refreshToken: faker.string.alphanumeric(20) });
    expect(result).toEqual(badRequest(validationSpy.errorValue));
    expect(refreshTokenUseCaseSpy.count).toBe(0);
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = { refreshToken: faker.string.alphanumeric(20) };
    await sut.handle(request);
    expect(validationSpy.params).toEqual(request);
  })

  it('Should return serverError if Validation throws', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.throwsError = true;
    const result = await sut.handle({ refreshToken: faker.string.alphanumeric(20) });
    expect(result).toEqual(serverError(validationSpy.errorValue));
  })

  it('Should call RefreshTokenUseCase with correct values', async () => {
    const { sut, refreshTokenUseCaseSpy } = makeSut();
    const request = { refreshToken: faker.string.alphanumeric(20) };
    await sut.handle(request);
    expect(refreshTokenUseCaseSpy.params).toEqual(request);
    expect(refreshTokenUseCaseSpy.count).toBe(1);
  })

  it('Should return serverError if RefreshTokenUseCase throws', async () => {
    const { sut, refreshTokenUseCaseSpy } = makeSut();
    refreshTokenUseCaseSpy.returnError = true;
    const result = await sut.handle({ refreshToken: faker.string.alphanumeric(20) });
    expect(result).toEqual(serverError(refreshTokenUseCaseSpy.errorValue));
  })

  it('Should return ok on success', async () => {
    const { sut, refreshTokenUseCaseSpy } = makeSut();
    const result = await sut.handle({ refreshToken: faker.string.alphanumeric(20) });
    expect(result).toEqual(ok(refreshTokenUseCaseSpy.result));
  })
})