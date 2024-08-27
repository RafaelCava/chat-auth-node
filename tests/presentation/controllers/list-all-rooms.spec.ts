import { ListAllRoomsController } from '@/presentation/controllers';
import { ValidationSpy } from '../mocks';
import { Spy } from '@/tests/shared/spy';
import { ListAllRoomsUseCase } from '@/domain/usecases';
import { faker } from '@faker-js/faker';
import { makeRoom } from '@/tests/domain/mocks';

class ListAllRoomsUseCaseSpy implements ListAllRoomsUseCase, Spy<ListAllRoomsUseCase.Params, ListAllRoomsUseCase.Result> {
  params: ListAllRoomsUseCase.Params;
  count: number = 0;
  returnError: boolean = false;
  returnNull?: boolean = false;
  errorValue: Error = new Error(faker.lorem.sentence(3))
  result: ListAllRoomsUseCase.Result = [makeRoom({}), makeRoom({})];
  async listAll (params: ListAllRoomsUseCase.Params): Promise<ListAllRoomsUseCase.Result> {
    this.params = params
    ++this.count
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve([]) : Promise.resolve(this.result))
  }
}

type SutTypes = {
  sut: ListAllRoomsController
  validationSpy: ValidationSpy
  listAllRoomsUseCaseSpy: ListAllRoomsUseCaseSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const listAllRoomsUseCaseSpy = new ListAllRoomsUseCaseSpy()
  const sut = new ListAllRoomsController(validationSpy, listAllRoomsUseCaseSpy)
  return {
    sut,
    validationSpy,
    listAllRoomsUseCaseSpy
  }
}

describe('ListAllRooms', () => {
  it('Should be defined', () => {
    const { sut, listAllRoomsUseCaseSpy, validationSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(listAllRoomsUseCaseSpy).toBeDefined()
    expect(validationSpy).toBeDefined()
  })
})