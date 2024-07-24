import { TokenLogin } from "@/domain/models";
import { RefreshTokenUseCase } from "@/domain/usecases";
import { AccessDeniedError } from "@/presentation/erros";
import { badRequest, forbidden, ok, serverError } from "@/presentation/helpers/http-helper";
import { Controller, HttpResponse, Validation } from "@/presentation/protocols";

export class RefreshTokenController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}
  
  async handle (request: RefreshTokenController.Request): Promise<RefreshTokenController.Result> {
    try {
      const error = await this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const tokenAuth = await this.refreshTokenUseCase.refreshToken(request)
      return ok(tokenAuth)
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        return forbidden(error)
      }
      return serverError(error)
    }
  }
}

export namespace RefreshTokenController {
  export type Request = {
    refreshToken: string;
  };

  export type Result = HttpResponse<TokenLogin | Error>
}