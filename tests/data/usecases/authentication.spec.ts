import { Authentication } from "@/data/usecases"
import { FindUserByEmailRepositorySpy } from "../mocks/repositories"
import { EncrypterSpy, HashComparerSpy } from "../mocks"
import { faker } from "@faker-js/faker"

type SutTypes = {
  findUserByEmailRepositorySpy: FindUserByEmailRepositorySpy
  sut: Authentication
  encrypterSpy: EncrypterSpy
  hashComparerSpy: HashComparerSpy 
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy =  new FindUserByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new Authentication(findUserByEmailRepositorySpy, hashComparerSpy, encrypterSpy)
  return {
    sut,
    findUserByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy
  }
}

describe('Authentication Usecase', () => {
  it('Should be defined', () => {
    const { sut, encrypterSpy, findUserByEmailRepositorySpy, hashComparerSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(encrypterSpy).toBeDefined()
    expect(findUserByEmailRepositorySpy).toBeDefined()
    expect(hashComparerSpy).toBeDefined()
  })

  it('Should call FindUserByEmailRepository with correct email', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    await sut.auth(params)
    expect(findUserByEmailRepositorySpy.params).toEqual({email: params.email, projection: ['id', 'email', 'password']})
    expect(findUserByEmailRepositorySpy.count).toBe(1)
  })
})