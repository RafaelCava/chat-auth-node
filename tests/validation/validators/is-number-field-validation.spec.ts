import { InvalidParamError } from "@/presentation/erros"
import { IsNumberFieldValidation } from "@/validation/validators"
import { faker } from "@faker-js/faker"

const makeSut = (field = 'field') => {
  const sut = new IsNumberFieldValidation(field)
  
  return {
    sut
  }
}

describe('IsNumberFieldValidation', () => {
  it('Should be defined', () => {
    const {sut} = makeSut()
    expect(sut).toBeDefined()
  })

  it('Should return a InvalidParamError if validation fails', async () => {
    const {sut} = makeSut()
    const result = sut.validate({field: 'invalid'})
    expect(result).rejects.toEqual(new InvalidParamError('field'))
  })

  it('Should return null if validation success', async () => {
    const {sut} = makeSut()
    const result = await sut.validate({field: faker.number.int()})
    expect(result).toBeNull()
  })
})