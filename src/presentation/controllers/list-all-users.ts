import { User } from "@/domain/entities";
import { Controller, HttpResponse, Validation } from "../protocols";
import { badRequest, ok, serverError } from "../helpers/http-helper";
import { ListAllUsersUseCase } from "@/domain/usecases";

export class ListAllUsersController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly listAllUsersUseCase: ListAllUsersUseCase,
  ) {}

  async handle(
    request: ListAllUsersController.Params,
  ): Promise<ListAllUsersController.Result> {
    try {
      const error = await this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const users = await this.listAllUsersUseCase.listAll({
        limit: Number(request.limit),
        page: Number(request.page),
      });
      return ok(users);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace ListAllUsersController {
  export type Params = {
    limit: string;
    page: string;
  };
  export type Result = HttpResponse<User[] | Error>;
}
