import { LoginController } from "@/presentation/controllers"
import { ValidationSpy } from "../mocks"
import { AuthenticationUseCase } from "@/domain/usecases"
import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { badRequest, serverError } from "@/presentation/helpers/http-helper"

class AuthenticationSpy implements AuthenticationUseCase, Spy {
  params: AuthenticationUseCase.Params
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: AuthenticationUseCase.Result = {
    accessToken: faker.string.alphanumeric(20),
    refreshToken: faker.string.alphanumeric(20)
  }

  async auth (params: AuthenticationUseCase.Params): Promise<AuthenticationUseCase.Result> {
    this.params = params
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    if (this.returnNull) {
      return Promise.resolve(null)
    }
    return Promise.resolve(this.result)  
  }
}

type SutTypes = {
  sut: LoginController
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(validationSpy, authenticationSpy)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

describe('Login Controller', () => {
  it('Should be defined', () => {
    const { authenticationSpy, sut, validationSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(authenticationSpy).toBeDefined()
    expect(validationSpy).toBeDefined()
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    await sut.handle(request)
    expect(validationSpy.params).toEqual(request)
    expect(validationSpy.count).toBe(1)
  })

  it('Should return badRequest if Validation returns an error', async () => {
    const { sut, validationSpy, authenticationSpy } = makeSut()
    validationSpy.returnError = true
    const response = await sut.handle({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    expect(response).toEqual(badRequest(validationSpy.errorValue))
    expect(authenticationSpy.count).toBe(0)
  })

  it('Should return serverError if Validation throws', async () => {
    const { sut, validationSpy, authenticationSpy } = makeSut()
    validationSpy.throwsError = true
    const response = await sut.handle({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    expect(response).toEqual(serverError(validationSpy.errorValue))
    expect(authenticationSpy.count).toBe(0)
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual(request)
    expect(authenticationSpy.count).toBe(1)
  })

  it('Should return serverError if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.returnError = true
    const response = await sut.handle({
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    expect(response).toEqual(serverError(authenticationSpy.errorValue))
  })
})