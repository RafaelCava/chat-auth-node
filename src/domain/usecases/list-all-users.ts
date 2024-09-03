import { User } from "../entities";

export interface ListAllUsersUseCase {
  listAll: (
    params: ListAllUsersUseCase.Params,
  ) => Promise<ListAllUsersUseCase.Result>;
}

export namespace ListAllUsersUseCase {
  export type Params = {
    limit: number;
    page: number;
  };

  export type Result = User[];
}
