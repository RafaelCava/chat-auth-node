import { ok, serverError } from '../helpers/http-helper'
import { type HttpResponse, type Controller, type Validation } from '../protocols'

export class HealthCheckController implements Controller<any, HealthCheckController.HttpBodyContent> {
  constructor (private readonly validation: Validation) {}
  async handle (request: any): Promise<HealthCheckController.Result> {
    try {
      const validationError = await this.validation.validate(request)
      if (validationError) {
        return serverError(validationError)
      }
      return ok({ message: 'Server is running' })
    } catch (error) {
      return serverError(error)      
    }
  }
}

export namespace HealthCheckController {
  export type Result = HttpResponse<HttpBodyContent>
  export type HttpBodyContent = { message: string } | Error
}