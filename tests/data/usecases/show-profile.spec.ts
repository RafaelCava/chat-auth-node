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
})