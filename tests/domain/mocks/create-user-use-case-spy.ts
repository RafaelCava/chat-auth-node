import { CreateUserUseCase } from '@/domain/usecases/create-user';
import { Spy } from '@/tests/shared/spy';
import { faker } from '@faker-js/faker';
import { makeCreateUserUseCaseResponse } from './make-create-user-use-case-response';
export class CreateUserUseCaseSpy implements CreateUserUseCase, Spy<CreateUserUseCase.Params, CreateUserUseCase.Response> {
  params: CreateUserUseCase.Params;
  count: number = 0;
  returnError: boolean;
  returnNull?: boolean;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: CreateUserUseCase.Response = makeCreateUserUseCaseResponse();
  create(data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Response> {
    ++this.count;
    this.params = data;
    if (this.returnError) {
      return Promise.reject(this.errorValue);
    }
    if (this.returnNull) {
      return Promise.resolve(null);
    }
    return Promise.resolve(this.result);
  }
}