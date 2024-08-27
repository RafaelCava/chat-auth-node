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
    if (this.returnNull) return await Promise.resolve([])
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


const makeRequest = () => ({
  limit: faker.number.int(100),
  page: faker.number.int(100),
  filters: {
    name: faker.lorem.word(),
    ownerId: faker.string.uuid(),
  }
})

describe('ListAllRoomsUseCase', () => {
  it('Should be defined', () => {
    const { findRoomsRepositorySpy, sut } = makeSut()
    expect(sut).toBeDefined()
    expect(findRoomsRepositorySpy).toBeDefined()
  })

  it('Should call FindRoomsRepository with correct params', async () => {
    const { findRoomsRepositorySpy, sut } = makeSut()
    const params = makeRequest()
    await sut.listAll(params)
    expect(findRoomsRepositorySpy.count).toBe(1)
    expect(findRoomsRepositorySpy.params).toEqual(params)
  })

  it('Should throw if FindRoomsRepository throws', async () => {
    const { findRoomsRepositorySpy, sut } = makeSut()
    findRoomsRepositorySpy.returnError = true
    const promise = sut.listAll(makeRequest())
    await expect(promise).rejects.toThrow(findRoomsRepositorySpy.errorValue)
  })

  it('Should return empty list if FindRoomsRepository returns null', async () => {
    const { findRoomsRepositorySpy, sut } = makeSut()
    findRoomsRepositorySpy.returnNull = true
    const result = await sut.listAll(makeRequest())
    expect(result).toEqual([])
  })
})