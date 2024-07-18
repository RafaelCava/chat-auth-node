import { TokenLogin } from "@/domain/models";
import { Controller, HttpResponse } from "@/presentation/protocols";

export class RefreshController implements Controller {
  async handle (request: RefreshController.Request): Promise<RefreshController.Result> {
    return null
  }
}

export namespace RefreshController {
  export type Request = {
    refreshToken: string;
  };

  export type Result = HttpResponse<TokenLogin | Error>
}