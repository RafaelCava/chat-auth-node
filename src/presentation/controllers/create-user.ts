import { CreateUserUseCase } from "@/domain/usecases";
import { badRequest, created, serverError } from "../helpers/http-helper";
import { Controller, HttpResponse, Validation } from "../protocols";
import { UserExistsError } from "../erros";

export class CreateUserController
  implements Controller<CreateUserController.Request>
{
  constructor(
    private readonly validation: Validation,
    private readonly createUser: CreateUserUseCase,
  ) {}

  async handle(
    request: CreateUserController.Request,
  ): Promise<CreateUserController.Response> {
    try {
      const error = await this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = request;
      const user = await this.createUser.create({ name, email, password });
      return created(user);
    } catch (error) {
      if (error instanceof UserExistsError) {
        return badRequest(error);
      }
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

  export type Response = HttpResponse<CreateUserUseCase.Response | Error>;
}
