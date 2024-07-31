import { CreateRoomUseCase } from "@/domain/usecases"
import { ValidationSpy } from "../mocks"
import { CreateRoomController } from "@/presentation/controllers"
import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { makeRoom } from "@/tests/domain/mocks"

class CreateRoomSpy implements CreateRoomUseCase, Spy {
  params: CreateRoomUseCase.Params
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: CreateRoomUseCase.Response = makeRoom({})

  async create(data: CreateRoomUseCase.Params): Promise<CreateRoomUseCase.Response> {
    this.count++
    this.params = data
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}

const makeSut = () => {
  const validationSpy = new ValidationSpy()
  const createRoomUseCaseSpy = new CreateRoomSpy()
  const sut = new CreateRoomController(validationSpy, createRoomUseCaseSpy)
  return {
    sut,
    validationSpy,
    createRoomUseCaseSpy
  }
}

describe('CreateRoom Controller', () => {
  it('Should be defined', () => {
    const { createRoomUseCaseSpy, sut, validationSpy } = makeSut()
    expect(createRoomUseCaseSpy).toBeDefined()
    expect(sut).toBeDefined()
    expect(validationSpy).toBeDefined()
  })
})