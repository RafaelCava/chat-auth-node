import { LoadUserByToken } from "@/data/usecases"
import { Decrypter } from "@/data/protocols/criptography"
import { FindUserByIdRepository } from "@/data/protocols/db"
import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { makeUser } from "@/tests/domain/mocks"

class DecrypterSpy implements Decrypter, Spy {
  params: string
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: Decrypter.Result = { id: faker.string.uuid() }
  async decrypt (value: string): Promise<Decrypter.Result> {
    this.params = value
    this.count++
    if (this.returnError) throw this.errorValue
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}

class FindUserByIdRepositorySpy implements FindUserByIdRepository, Spy {
  params: FindUserByIdRepository.Params
  count: number = 0 
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: FindUserByIdRepository.Result = makeUser()
  async findById (params: FindUserByIdRepository.Params): Promise<FindUserByIdRepository.Result> {
    this.params = params
    this.count++
    if (this.returnError) throw this.errorValue
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}

type SutTypes = {
  sut: LoadUserByToken
  decrypterSpy: DecrypterSpy
  findUserByIdRepositorySpy: FindUserByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const findUserByIdRepositorySpy = new FindUserByIdRepositorySpy()
  const decrypterSpy = new DecrypterSpy()
  const sut = new LoadUserByToken(decrypterSpy, findUserByIdRepositorySpy)
  
  return {
    sut,
    decrypterSpy, 
    findUserByIdRepositorySpy
  }
}

describe('LoadUserByToken Usecase', () => {
  it('Should be defined', () => {
    const { decrypterSpy, findUserByIdRepositorySpy, sut } = makeSut()
    expect(decrypterSpy).toBeDefined()
    expect(findUserByIdRepositorySpy).toBeDefined()
    expect(sut).toBeDefined()
  })
})