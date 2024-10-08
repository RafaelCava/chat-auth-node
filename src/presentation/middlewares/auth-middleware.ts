import { JsonWebTokenError } from "jsonwebtoken";
import { LoadUserByTokenUseCase } from "@/domain/usecases";
import { AccessDeniedError } from "../erros";
import { forbidden, ok, serverError } from "../helpers/http-helper";
import { Middleware, HttpResponse } from "../protocols";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadUserByToken: LoadUserByTokenUseCase,
    private readonly role?: string,
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;
      if (!accessToken) return forbidden(new AccessDeniedError());
      const user = await this.loadUserByToken.load({
        accessToken,
        role: this.role,
      });
      if (!user) return forbidden(new AccessDeniedError());
      return ok({ userId: user.id });
    } catch (err) {
      if (err instanceof JsonWebTokenError)
        return forbidden(new AccessDeniedError());
      return serverError(err);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}
