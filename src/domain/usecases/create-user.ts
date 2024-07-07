import { User } from "../entities";

export interface CreateUserUseCase {
  create(data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Response>;
}

export namespace CreateUserUseCase {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = Omit<User, 'password'>;
}