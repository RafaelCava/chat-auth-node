import { RefreshToken } from '@/data/usecases';
import { DecrypterSpy, EncrypterSpy, FindUserByIdRepositorySpy } from '../mocks';
import { faker } from '@faker-js/faker';
import { AccessDeniedError } from '@/presentation/erros';

type SutTypes = {
  sut: RefreshToken
  decrypterSpy: DecrypterSpy
  findUserByIdRepository: FindUserByIdRepositorySpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const findUserByIdRepository = new FindUserByIdRepositorySpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new RefreshToken(decrypterSpy, findUserByIdRepository, encrypterSpy)
  
  return {
    sut,
    decrypterSpy,
    findUserByIdRepository,
    encrypterSpy
  }
}

describe('Refresh Token Use Case', () => {
  it('Should be defined', () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    expect(decrypterSpy).toBeDefined()
    expect(findUserByIdRepository).toBeDefined()
    expect(encrypterSpy).toBeDefined()
    expect(sut).toBeDefined()
  })

  it('Should call Decrypter with correct values', async () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    const mockToken = faker.string.alphanumeric(20)
    await sut.refreshToken({
      refreshToken: mockToken
    })
    expect(decrypterSpy.params).toBe(mockToken)
    expect(decrypterSpy.count).toBe(1)
  })

  it('Should throw if Decrypter throws', async () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    decrypterSpy.returnError = true
    await expect(sut.refreshToken({
      refreshToken: faker.string.alphanumeric(20)
    })).rejects.toThrow(decrypterSpy.errorValue)
    expect(decrypterSpy.count).toBe(1)
    expect(findUserByIdRepository.count).toBe(0)
    expect(encrypterSpy.count).toBe(0)
  })

  it('Should throw AccessDeniedError if Decrypter returns null', async () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    decrypterSpy.result = null
    await expect(sut.refreshToken({
      refreshToken: faker.string.alphanumeric(20)
    })).rejects.toThrow(new AccessDeniedError())
    expect(decrypterSpy.count).toBe(1)
    expect(findUserByIdRepository.count).toBe(0)
    expect(encrypterSpy.count).toBe(0)
  })

  it('Should call FindUserByIdRepository with correct values', async () => {
    const { decrypterSpy, findUserByIdRepository, sut } = makeSut()
    const mockToken = faker.string.alphanumeric(20)
    await sut.refreshToken({
      refreshToken: mockToken
    })
    expect(findUserByIdRepository.params).toEqual({id: decrypterSpy.result.id })
    expect(findUserByIdRepository.count).toBe(1)
  })

  it('Should throw if FindUserByIdRepository throws', async () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    findUserByIdRepository.returnError = true
    await expect(sut.refreshToken({
      refreshToken: faker.string.alphanumeric(20)
    })).rejects.toThrow(findUserByIdRepository.errorValue)
    expect(decrypterSpy.count).toBe(1)
    expect(findUserByIdRepository.count).toBe(1)
    expect(encrypterSpy.count).toBe(0)
  })

  it('Should throw AccessDeniedError if FindUserByIdRepository returns null', async () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    findUserByIdRepository.returnNull = true
    await expect(sut.refreshToken({
      refreshToken: faker.string.alphanumeric(20)
    })).rejects.toThrow(new AccessDeniedError())
    expect(decrypterSpy.count).toBe(1)
    expect(findUserByIdRepository.count).toBe(1)
    expect(encrypterSpy.count).toBe(0)
  })

  it('Should call Encrypter with correct values', async () => {
    const { findUserByIdRepository, encrypterSpy, sut } = makeSut()
    const mockToken = faker.string.alphanumeric(20)
    await sut.refreshToken({
      refreshToken: mockToken
    })
    expect(encrypterSpy.params).toEqual({ value: findUserByIdRepository.result.id, expiresIn: '2d' })
    expect(encrypterSpy.count).toBe(2)
  })

  it('Should throw if Encrypter throws', async () => {
    const { decrypterSpy, findUserByIdRepository, encrypterSpy, sut } = makeSut()
    encrypterSpy.returnError = true
    await expect(sut.refreshToken({
      refreshToken: faker.string.alphanumeric(20)
    })).rejects.toThrow(encrypterSpy.errorValue)
    expect(decrypterSpy.count).toBe(1)
    expect(findUserByIdRepository.count).toBe(1)
    expect(encrypterSpy.count).toBe(1)
  })

  it('Should return an accessToken and refreshToken on success', async () => {
    const { encrypterSpy, sut } = makeSut()
    const mockToken = faker.string.alphanumeric(20)
    const response = await sut.refreshToken({
      refreshToken: mockToken
    })
    expect(response).toEqual({
      accessToken: encrypterSpy.result,
      refreshToken: encrypterSpy.result
    })
  })
})