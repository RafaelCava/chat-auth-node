import { CreateRoom } from "@/data/usecases";
import { CreateRoomRepository, FindRoomByNameRepository } from "@/data/protocols/db";
import { Spy } from "@/tests/shared/spy";
import { faker } from "@faker-js/faker";
import { makeRoom } from "@/tests/domain/mocks";
import { Room } from "@/domain/entities";

class FindRoomByNameRepositorySpy implements FindRoomByNameRepository, Spy {
  params: FindRoomByNameRepository.Params;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence(3));
  result: FindRoomByNameRepository.Result = makeRoom({});
  async findByName(params: FindRoomByNameRepository.Params): Promise<FindRoomByNameRepository.Result> {
    ++this.count
    this.params = params
    if (this.returnError) {
      throw this.errorValue
    }
    if (this.returnNull) {
      return await Promise.resolve(null)
    }
    return await Promise.resolve(this.result)
  }
}

class CreateRoomRepositorySpy implements CreateRoomRepository, Spy<CreateRoomRepository.Params, CreateRoomRepository.Result> {
  params: Room;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence(3));
  result: Room = makeRoom({});

  async create(params: CreateRoomRepository.Params): Promise<CreateRoomRepository.Result> {
    ++this.count
    this.params = params
    if (this.returnError) {
      throw this.errorValue
    }
    if (this.returnNull) {
      return await Promise.resolve(null)
    }
    return await Promise.resolve(this.result)
  }
}

type SutTypes = {
  sut: CreateRoom
  findRoomByNameRepositorySpy: FindRoomByNameRepositorySpy
  createRoomRepositorySpy: CreateRoomRepositorySpy
}

const makeSut = (): SutTypes => {
  const findRoomByNameRepositorySpy = new FindRoomByNameRepositorySpy()
  const createRoomRepositorySpy = new CreateRoomRepositorySpy()
  const sut = new CreateRoom(findRoomByNameRepositorySpy, createRoomRepositorySpy)
  return {
    sut,
    findRoomByNameRepositorySpy,
    createRoomRepositorySpy
  }
}

const makeParams = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.sentence(3),
  ownerId: faker.string.uuid()
})

describe('CreateRoom', () => {
  it('Should be defined', () => {
    const { createRoomRepositorySpy, findRoomByNameRepositorySpy, sut } = makeSut()
    expect(sut).toBeDefined()
    expect(createRoomRepositorySpy).toBeDefined()
    expect(findRoomByNameRepositorySpy).toBeDefined()
  })

  it('Should call FindRoomByNameRepository with correct values', async () => {
    const {findRoomByNameRepositorySpy, sut } = makeSut()
    findRoomByNameRepositorySpy.returnNull = true
    const params = makeParams()
    await sut.create(params)
    expect(findRoomByNameRepositorySpy.count).toBe(1)
    expect(findRoomByNameRepositorySpy.params).toEqual({ name: params.name, projection: ['id'] })
  })

  it('Should throw if FindRoomByNameRepository throws', async () => {
    const {findRoomByNameRepositorySpy, sut } = makeSut()
    findRoomByNameRepositorySpy.returnError = true
    const promise = sut.create(makeParams())
    await expect(promise).rejects.toThrow(findRoomByNameRepositorySpy.errorValue)
  })
});