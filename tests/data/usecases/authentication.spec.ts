import { Authentication } from "@/data/usecases"
import { FindUserByEmailRepositorySpy } from "../mocks/repositories"
import { EncrypterSpy, HashComparerSpy } from "../mocks"
import { faker } from "@faker-js/faker"
import { AccessDeniedError, UserNotExistsError } from "@/presentation/erros"

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

  it('Should throw if FindUserByEmailRepository throws', async () => {
    const { sut, findUserByEmailRepositorySpy, encrypterSpy, hashComparerSpy } = makeSut()
    findUserByEmailRepositorySpy.throwError = true
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
    expect(encrypterSpy.count).toBe(0)
    expect(hashComparerSpy.count).toBe(0)
  })

  it('Should throw UserNotExistsError if FindUserByEmailRepository returns null', async () => {
    const { sut, findUserByEmailRepositorySpy, encrypterSpy, hashComparerSpy } = makeSut()
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    findUserByEmailRepositorySpy.returnNull = true
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow(new UserNotExistsError())
    expect(encrypterSpy.count).toBe(0)
    expect(hashComparerSpy.count).toBe(0)
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, findUserByEmailRepositorySpy, hashComparerSpy } = makeSut()
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    await sut.auth(params)
    expect(hashComparerSpy.params).toEqual({value: params.password, hash: findUserByEmailRepositorySpy.result.password})
    expect(hashComparerSpy.count).toBe(1)
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy, encrypterSpy } = makeSut()
    hashComparerSpy.returnError = true
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow()
    expect(encrypterSpy.count).toBe(0)
  })

  it('Should throw AccessDeniedError if HashComparer returns false', async () => {
    const { sut, hashComparerSpy, encrypterSpy } = makeSut()
    hashComparerSpy.result = false
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow(new AccessDeniedError())
    expect(encrypterSpy.count).toBe(0)
  })

  it('Should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy, findUserByEmailRepositorySpy } = makeSut()
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    await sut.auth(params)
    expect(encrypterSpy.params).toEqual({value: findUserByEmailRepositorySpy.result.id, expiresIn: '2d'})
    expect(encrypterSpy.count).toBe(2)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.returnError = true
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const promise = sut.auth(params)
    await expect(promise).rejects.toThrow(encrypterSpy.errorValue)
  })

  it('Should return TokenLogin on success', async () => {
    const { sut, encrypterSpy } = makeSut()
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const result = await sut.auth(params)
    expect(result).toEqual({accessToken: encrypterSpy.result, refreshToken: encrypterSpy.result})
  })
})