import { faker } from "@faker-js/faker";
import { Spy } from "@/tests/shared/spy";
import { CreateRoomUseCase } from "@/domain/usecases";
import { makeRoom } from "./room";

export class CreateRoomSpy implements CreateRoomUseCase, Spy {
  params: CreateRoomUseCase.Params;

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence());

  result: CreateRoomUseCase.Response = makeRoom({});

  async create(
    data: CreateRoomUseCase.Params,
  ): Promise<CreateRoomUseCase.Response> {
    this.count++;
    this.params = data;
    if (this.returnError) {
      throw this.errorValue;
    }
    return await (this.returnNull
      ? Promise.resolve(null)
      : Promise.resolve(this.result));
  }
}
