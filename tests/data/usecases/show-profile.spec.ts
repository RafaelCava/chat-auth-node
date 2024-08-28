import { ShowProfile } from "@/data/usecases"
import { FindUserByIdRepositorySpy } from "../mocks"

const makeSut = () => {
  const findUserByIdRepositorySpy = new FindUserByIdRepositorySpy()
  const sut = new ShowProfile(findUserByIdRepositorySpy)
  
  return {
    sut,
    findUserByIdRepositorySpy
  }
}

describe('ShowProfileUseCase', () => {
  it('should be defined', () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    expect(sut).toBeDefined()
    expect(findUserByIdRepositorySpy).toBeDefined()
  })

  it('Should call findById with correct values', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    await sut.show('any_id')
    expect(findUserByIdRepositorySpy.params).toEqual({ id: 'any_id', projection: ['name', 'email', 'createdAt', 'email', "updatedAt", "id"] })
    expect(findUserByIdRepositorySpy.count).toBe(1)
  })

  it('Should throw if FindUserByIdRepository throws', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    findUserByIdRepositorySpy.returnError = true
    await expect(sut.show('any_id')).rejects.toThrow(findUserByIdRepositorySpy.errorValue)
  })
})