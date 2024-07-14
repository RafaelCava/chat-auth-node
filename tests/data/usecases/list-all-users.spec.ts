import { ListAllUsers } from "@/data/usecases"
import { faker } from '@faker-js/faker';
import { FindUsersRepositorySpy } from '../mocks/repositories';


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