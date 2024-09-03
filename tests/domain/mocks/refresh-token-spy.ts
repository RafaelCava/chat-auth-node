import { faker } from "@faker-js/faker";
import { Spy } from "@/tests/shared/spy";
import { RefreshTokenUseCase } from "@/domain/usecases";

export class RefreshTokenUseCaseSpy implements RefreshTokenUseCase, Spy {
  params: RefreshTokenUseCase.Params;

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence());

  result: RefreshTokenUseCase.Result = {
    accessToken: faker.string.alphanumeric(20),
    refreshToken: faker.string.alphanumeric(20),
  };

  async refreshToken(
    data: RefreshTokenUseCase.Params,
  ): Promise<RefreshTokenUseCase.Result> {
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
