import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { AccessDeniedError } from '@/presentation/erros'
import { LoadUserByTokenSpy } from '@/tests/domain/mocks'

type SutTypes = {
  sut: AuthMiddleware
  loadUserByTokenSpy: LoadUserByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadUserByTokenSpy = new LoadUserByTokenSpy()
  const sut = new AuthMiddleware(loadUserByTokenSpy, role)
  return {
    sut,
    loadUserByTokenSpy
  }
}

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

describe('Auth Middleware', () => {
  it('Should return 403 if no headers are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadUserByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadUserByTokenSpy } = makeSut(role)
    await sut.handle(mockRequest())
    expect(loadUserByTokenSpy.params).toEqual({accessToken: 'any_token', role})
    expect(loadUserByTokenSpy.count).toBe(1)
  })

  it('Should returns 500 if LoadUserByToken throws', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.returnError = true
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(loadUserByTokenSpy.errorValue))
  })

  it('Should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.returnNull = true
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadUserByToken returns an account', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({userId: loadUserByTokenSpy.result.id}))
  })
})
