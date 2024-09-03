import { User } from "@/domain/entities";

export interface CreateUserRepository {
  create: (
    params: CreateUserRepository.Params,
  ) => Promise<CreateUserRepository.Result>;
}

export namespace CreateUserRepository {
  export type Params = User;

  export type Result = User;
}
