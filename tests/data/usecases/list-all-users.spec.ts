import { FindUsersRepository } from '@/data/protocols';
import { ListAllUsers } from "@/data/usecases"
import { makeUser } from '@/tests/domain/mocks';
import { Spy } from "@/tests/shared/spy"
import { faker } from '@faker-js/faker';

class FindUsersRepositorySpy implements FindUsersRepository, Spy {
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

const makeSut = () => {
  const findUsersRepositorySpy = new FindUsersRepositorySpy()
  const sut = new ListAllUsers(findUsersRepositorySpy)

  return {
    sut,
    findUsersRepositorySpy
  }
}

describe('ListAllUsersUseCase', () => {
  it('Should be defined', () => {
    const { findUsersRepositorySpy, sut } = makeSut()
    expect(sut).toBeDefined()
    expect(findUsersRepositorySpy).toBeDefined()
  })
})