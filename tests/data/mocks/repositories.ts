import { Spy } from '@/tests/shared/spy';
import { CreateUserRepository, FindUserByEmailRepository, FindUsersRepository } from '@/data/protocols';
import { faker } from '@faker-js/faker';
import { User } from '@/domain/entities';
import { makeUser } from '@/tests/domain/mocks';

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

export class FindUsersRepositorySpy implements FindUsersRepository, Spy {
  params: FindUsersRepository.Params;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence());
  result: FindUsersRepository.Result = [makeUser(), makeUser(), makeUser()];
  async findAll(params: FindUsersRepository.Params): Promise<FindUsersRepository.Result> {
    this.params = params
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve([]) : Promise.resolve(this.result))
  }
}