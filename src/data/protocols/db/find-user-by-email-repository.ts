import { User } from "@/domain/entities";

export interface FindUserByEmailRepository {
  findByEmail(
    params: FindUserByEmailRepository.Params,
  ): Promise<FindUserByEmailRepository.Result>;
}

export namespace FindUserByEmailRepository {
  export type Result = null | Partial<User>;

  export type Params = {
    email: string;
    projection?: Array<keyof User>;
  };
}
