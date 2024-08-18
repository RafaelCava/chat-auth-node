import { CreateRoomUseCase } from "@/domain/usecases"
import { ValidationSpy } from "../mocks"
import { CreateRoomController } from "@/presentation/controllers"
import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { makeRoom } from "@/tests/domain/mocks"
import { badRequest, conflict, created, serverError } from "@/presentation/helpers/http-helper"
import { RoomNameAlreadyInUseError } from "@/presentation/erros"

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

const makeRequest = () => ({
  name: faker.vehicle.vehicle(),
  userId: faker.string.uuid(),
  description: faker.lorem.sentence(5)
})

describe('CreateRoom Controller', () => {
  it('Should be defined', () => {
    const { createRoomUseCaseSpy, sut, validationSpy } = makeSut()
    expect(createRoomUseCaseSpy).toBeDefined()
    expect(sut).toBeDefined()
    expect(validationSpy).toBeDefined()
  })

  describe('Validation', () => {
    it('Should return badRequest if validation returns an error', async () => {
      const { sut, validationSpy, createRoomUseCaseSpy } = makeSut()
      validationSpy.returnError = true
      const result = await sut.handle(null)
      expect(result).toEqual(badRequest(validationSpy.errorValue))
      expect(createRoomUseCaseSpy.count).toBe(0)
    })
  
    it('Should return serverError if validation throws', async () => {
      const { sut, validationSpy, createRoomUseCaseSpy } = makeSut()
      validationSpy.throwsError = true
      const result = await sut.handle(null)
      expect(result).toEqual(serverError(validationSpy.errorValue))
      expect(createRoomUseCaseSpy.count).toBe(0)
    })
  })

  describe('CreateRoom', () => {
    it('Should call CreateRoom if correct values', async () => {
      const { sut, createRoomUseCaseSpy } = makeSut()
      const request = makeRequest()
      await sut.handle(request)
      expect(createRoomUseCaseSpy.count).toBe(1)
      expect(createRoomUseCaseSpy.params).toEqual({
        name: request.name,
        ownerId: request.userId,
        description: request.description
      })
    })

    it('Should return serverError if CreateRoom throws', async () => {
      const { sut, createRoomUseCaseSpy } = makeSut()
      createRoomUseCaseSpy.returnError = true
      const result = await sut.handle(makeRequest())
      expect(result).toEqual(serverError(createRoomUseCaseSpy.errorValue))
    })

    it('Should return conflict if CreateRoom throws RoomNameAlreadyInUseError', async () => {
      const { sut, createRoomUseCaseSpy } = makeSut()
      createRoomUseCaseSpy.returnError = true
      createRoomUseCaseSpy.errorValue = new RoomNameAlreadyInUseError()
      const result = await sut.handle(makeRequest())
      expect(result).toEqual(conflict(createRoomUseCaseSpy.errorValue))
    })

    it('Should return created if CreateRoom on success', async () => {
      const { sut, createRoomUseCaseSpy } = makeSut()
      const result = await sut.handle(makeRequest())
      expect(result).toEqual(created(createRoomUseCaseSpy.result))
    })
  })
})