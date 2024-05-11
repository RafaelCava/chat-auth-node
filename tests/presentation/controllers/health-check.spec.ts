import { Validation } from "@/presentation/protocols";
import { HealthCheckController } from "@/presentation/controllers/health-check";
import { faker } from '@faker-js/faker';
import { ValidationSpy } from "../mocks";
import { ok, serverError } from "@/presentation/helpers/http-helper";

type SutTypes = {
  sut: HealthCheckController
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new HealthCheckController(validationSpy)
  return {
    sut,
    validationSpy
  }
}

const makeRequest = () => ({
  [faker.lorem.word()]: faker.lorem.sentence()
})

describe("HealthCheck Controller", () => {
  it("should be defined", () => {
    const {sut, validationSpy} = makeSut()
    expect(sut).toBeDefined()
    expect(validationSpy).toBeDefined()
  })

  it("should call Validation with correct values", async () => {
    const {sut, validationSpy} = makeSut()
    const request = makeRequest()
    await sut.handle(request)
    expect(validationSpy.count).toBe(1)
    expect(validationSpy.params).toEqual(request)
  })

  it("should return 500 if Validation returns error", async () => {
    const {sut, validationSpy} = makeSut()
    validationSpy.returnError = true
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(validationSpy.errorValue))
  })

  it("should return 500 if Validation throws", async () => {
    const {sut, validationSpy} = makeSut()
    validationSpy.throwsError = true
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(validationSpy.errorValue))
  })

  it("should return 200 if Validation returns null", async () => {
    const {sut} = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(ok({ message: "Server is running" }))
  })
});