import { ListAllRooms } from "@/data/usecases"
import { Spy } from "@/tests/shared/spy"
import { FindRoomsRepository } from "@/data/protocols/db"
import { Room } from "@/domain/entities"
import { faker } from "@faker-js/faker"
import { makeRoom } from "@/tests/domain/mocks"

class FindRoomsRepositorySpy implements FindRoomsRepository, Spy<FindRoomsRepository.Params, FindRoomsRepository.Result> {
  params: FindRoomsRepository.Params
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence(3))
  result: Partial<Room>[] = [makeRoom({})]

  async find(params: FindRoomsRepository.Params): Promise<FindRoomsRepository.Result> {
    this.params = params
    ++this.count
    if (this.returnError) throw this.errorValue
    if (this.returnNull) return await Promise.resolve(null)
    return await Promise.resolve(this.result)
  }
}

type SutTypes = {
  findRoomsRepositorySpy: FindRoomsRepositorySpy
  sut: ListAllRooms
}

const makeSut = (): SutTypes => {
  const findRoomsRepositorySpy = new FindRoomsRepositorySpy()
  const sut = new ListAllRooms(findRoomsRepositorySpy)
  
  return {
    sut,
    findRoomsRepositorySpy
  }
}

describe('ListAllRoomsUseCase', () => {
  it('Should be defined', () => {
    const { findRoomsRepositorySpy, sut } = makeSut()
    expect(sut).toBeDefined()
    expect(findRoomsRepositorySpy).toBeDefined()
  })
})