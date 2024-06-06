export interface CreateUserUseCase {
  create(data: CreateUserUseCase.Params): Promise<CreateUserUseCase.Response>;
}

export namespace CreateUserUseCase {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}