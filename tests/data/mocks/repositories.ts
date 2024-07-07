import { Spy } from '@/tests/shared/spy';
import { CreateUserRepository, FindUserByEmailRepository } from '@/data/protocols';
import { faker } from '@faker-js/faker';
import { User } from '@/domain/entities';

export class FindUserByEmailRepositorySpy implements FindUserByEmailRepository, Spy {
  params: FindUserByEmailRepository.Params;
  count: number = 0;
  returnError: boolean;
  throwError: boolean;
  returnNull?: boolean = false
  errorValue = new Error(faker.lorem.sentence())
  result: FindUserByEmailRepository.Result = { id: faker.string.uuid() };
  findByEmail(params: FindUserByEmailRepository.Params): Promise<FindUserByEmailRepository.Result> {
    this.params = params
    this.count++
    if (this.throwError) {
      throw this.errorValue
    }
    return Promise.resolve(this.returnNull ? null : this.result)
  }
}

export class CreateUserRepositorySpy implements CreateUserRepository, Spy {
  params: CreateUserRepository.Params;
  count: number = 0;
  returnError: boolean;
  returnNull?: boolean;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: CreateUserRepository.Result;
  async create (params: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    this.params = params
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    this.result = new User({
      name: params.name,
      email: params.email,
      password: params.password
    }, faker.string.uuid())
    return this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result)
  }
}