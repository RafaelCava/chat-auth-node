import { LoadUserByToken } from '@/domain/usecases'
import { AccessDeniedError } from '../erros'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { Middleware, HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByToken: LoadUserByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (!accessToken) return forbidden(new AccessDeniedError())
      const user = await this.loadUserByToken.load({accessToken, role: this.role})
      if (!user) return forbidden(new AccessDeniedError())
      return ok({ userId: user.id })
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}

