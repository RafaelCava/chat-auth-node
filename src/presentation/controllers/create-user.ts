import { badRequest, created, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse, Validation } from "../protocols";

export class CreateUserController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createUser: CreateUserUseCase,
  ) {}

  async handle(request: CreateUserController.Request): Promise<CreateUserController.Response> {
    try {
      const error = await this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = request;
      const user = await this.createUser.create({ name, email, password });
      return created(user);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace CreateUserController {
  export type Request = {
    name: string;
    email: string;
    password: string;
  };

  export type Response = HttpResponse<CreateUserController | Error>

  export type CreateUserResponse = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
}