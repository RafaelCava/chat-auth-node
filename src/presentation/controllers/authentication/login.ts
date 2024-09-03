import { TokenLogin } from "@/domain/models";
import { Controller, HttpResponse, Validation } from "@/presentation/protocols";
import { AuthenticationUseCase } from "@/domain/usecases";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "@/presentation/helpers/http-helper";
import { AccessDeniedError, UserNotExistsError } from "@/presentation/erros";

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: AuthenticationUseCase,
  ) {}

  async handle(
    request: LoginController.Request,
  ): Promise<LoginController.Response> {
    try {
      const error = await this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const tokenAuth = await this.authentication.auth(request);
      return ok(tokenAuth);
    } catch (error) {
      if (
        [new AccessDeniedError().name, new UserNotExistsError().name].includes(
          error.name,
        )
      ) {
        return unauthorized(error);
      }
      return serverError(error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };

  export type Response = HttpResponse<TokenLogin | Error>;
}
