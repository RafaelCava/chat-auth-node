import { CreateUserUseCase } from '@/domain/usecases/create-user';
import { CreateUserController } from '@/presentation/controllers';
import { Spy } from '@/tests/shared/spy';
import { faker } from '@faker-js/faker';
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

export const makeCreateUserUseCaseResponse = (): CreateUserUseCase.Response => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
})

export const makeCreateUserControllerRequest = (): CreateUserController.Request => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})