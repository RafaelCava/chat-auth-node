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

  it('Should call FindUsersRepository with correct params', async () => {
    const { findUsersRepositorySpy, sut } = makeSut()
    const params = { limit: faker.number.int(), page: faker.number.int() }
    await sut.listAll(params)
    expect(findUsersRepositorySpy.params).toEqual({...params, projection: ['id', 'createdAt', 'email', 'name', 'updatedAt']})
    expect(findUsersRepositorySpy.count).toEqual(1)
  })

  it('Should return a list of users on success', async () => {
    const { findUsersRepositorySpy, sut } = makeSut()
    const result = await sut.listAll({ limit: faker.number.int(), page: faker.number.int() })
    expect(result).toEqual(findUsersRepositorySpy.result)
  })

  it('Should return an empty list if FindUsersRepository returns null', async () => {
    const { findUsersRepositorySpy, sut } = makeSut()
    findUsersRepositorySpy.returnNull = true
    const result = await sut.listAll({ limit: faker.number.int(), page: faker.number.int() })
    expect(result).toEqual([])
  })

  it('Should throw if FindUsersRepository throws', async () => {
    const { findUsersRepositorySpy, sut } = makeSut()
    findUsersRepositorySpy.returnError = true
    const promise = sut.listAll({ limit: faker.number.int(), page: faker.number.int() })
    expect(promise).rejects.toThrow(findUsersRepositorySpy.errorValue)
  })
})