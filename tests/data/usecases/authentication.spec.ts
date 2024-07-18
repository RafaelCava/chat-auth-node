import { Authentication } from "@/data/usecases"
import { FindUserByEmailRepositorySpy } from "../mocks/repositories"
import { EncrypterSpy, HashComparerSpy } from "../mocks"

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
})