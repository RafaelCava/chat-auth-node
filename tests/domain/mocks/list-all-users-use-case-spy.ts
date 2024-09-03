import { faker } from "@faker-js/faker";
import { Spy } from "@/tests/shared/spy";
import { ListAllUsersUseCase } from "@/domain/usecases";
import { makeUser } from "./user";

export class ListAllUsersUseCaseSpy implements ListAllUsersUseCase, Spy {
  params: ListAllUsersUseCase.Params;

  count: number = 0;

  returnError: boolean = false;

  returnNull?: boolean = false;

  errorValue: Error = new Error(faker.lorem.sentence());

  result: ListAllUsersUseCase.Result = [makeUser(), makeUser()];

  async listAll(
    params: ListAllUsersUseCase.Params,
  ): Promise<ListAllUsersUseCase.Result> {
    this.params = params;
    this.count++;
    if (this.returnError) {
      throw this.errorValue;
    }
    return this.returnNull ? [] : this.result;
  }
}
