import { User } from "@/domain/entities";

export interface FindUsersRepository {
  findAll(
    params: FindUsersRepository.Params,
  ): Promise<FindUsersRepository.Result>;
}

export namespace FindUsersRepository {
  export type Result = null | Partial<User>[];

  export type Params = {
    limit: number;
    page: number;
    projection?: Array<keyof User>;
  };
}
