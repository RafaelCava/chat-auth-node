import { ListAllUsersController } from "@/presentation/controllers"
import { ValidationSpy } from "../mocks"
import { ListAllUsersUseCase } from "@/domain/usecases"
import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { makeUser } from "@/tests/domain/mocks"

class ListAllUsersUseCaseSpy implements ListAllUsersUseCase, Spy {
  params: ListAllUsersUseCase.Params
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: ListAllUsersUseCase.Result = [makeUser(), makeUser()]
  async listAll (params: ListAllUsersUseCase.Params): Promise<ListAllUsersUseCase.Result> {
    this.params = params
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return this.returnNull ? null : this.result
  }
}

type SutTypes = {
  sut: ListAllUsersController
  validationSpy: ValidationSpy
  listAllUsersUseCaseSpy: ListAllUsersUseCaseSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const listAllUsersUseCaseSpy = new ListAllUsersUseCaseSpy()
  const sut = new ListAllUsersController(validationSpy, listAllUsersUseCaseSpy)
  
  return {
    sut, 
    validationSpy,
    listAllUsersUseCaseSpy
  }
}

describe('ListAllUsersController', () => {
  it('Should be defined', () => {
    const { listAllUsersUseCaseSpy, sut, validationSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(listAllUsersUseCaseSpy).toBeDefined()
    expect(validationSpy).toBeDefined()
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = {
      limit: faker.number.int().toString(),
      page: faker.number.int().toString()
    }
    await sut.handle(request)
    expect(validationSpy.params).toEqual(request)
    expect(validationSpy.count).toEqual(1)
  })
})