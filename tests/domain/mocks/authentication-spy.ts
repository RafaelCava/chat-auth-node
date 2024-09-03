import { faker } from "@faker-js/faker";
import { AuthenticationUseCase } from "@/domain/usecases";
import { Spy } from "@/tests/shared/spy";

export class AuthenticationSpy implements AuthenticationUseCase, Spy {
  params: AuthenticationUseCase.Params;

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence());

  result: AuthenticationUseCase.Result = {
    accessToken: faker.string.alphanumeric(20),
    refreshToken: faker.string.alphanumeric(20),
  };

  async auth(
    params: AuthenticationUseCase.Params,
  ): Promise<AuthenticationUseCase.Result> {
    this.params = params;
    this.count++;
    if (this.returnError) {
      throw this.errorValue;
    }
    if (this.returnNull) {
      return Promise.resolve(null);
    }
    return Promise.resolve(this.result);
  }
}
