import { ListAllRooms } from "@/data/usecases"
import { faker } from "@faker-js/faker"
import { FindRoomsRepositorySpy } from "../mocks"

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

  it('Should return a list of rooms on success', async () => {
    const { findRoomsRepositorySpy, sut } = makeSut()
    const result = await sut.listAll(makeRequest())
    expect(result).toEqual(findRoomsRepositorySpy.result)
  })
})