import { ListAllRoomsUseCase } from '@/domain/usecases';
import { faker } from '@faker-js/faker';
import { makeRoom } from './room';
import { Spy } from '@/tests/shared/spy';
export class ListAllRoomsUseCaseSpy implements ListAllRoomsUseCase, Spy<ListAllRoomsUseCase.Params, ListAllRoomsUseCase.Result> {
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