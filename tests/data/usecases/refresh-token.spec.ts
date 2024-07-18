import { RefreshToken } from '@/data/usecases';
import { DecrypterSpy, EncrypterSpy, FindUserByIdRepositorySpy } from '../mocks';

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
})