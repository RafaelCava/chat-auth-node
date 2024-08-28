import { User } from "@/domain/entities";
import { Controller, HttpResponse, Validation } from "../protocols";
import { ShowProfileUseCase } from "@/domain/usecases";
import { badRequest, ok, serverError } from "../helpers/http-helper";

export class ShowProfileController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly showProfile: ShowProfileUseCase,
  ) {}
  async handle (request: ShowProfileController.Request): Promise<HttpResponse<ShowProfileController.Response>> {
    try {
      const error = await this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const user = await this.showProfile.show(request.userId)
      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace ShowProfileController {
  export type Request = {
    userId: string
  }

  export type Response = Omit<User, 'password'> | Error
}