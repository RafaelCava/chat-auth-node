import { MissingParamError } from '@/presentation/erros'
import { RequiredFieldValidation } from '@/validation/validators'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', async () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).rejects.toEqual(new MissingParamError('any_field'))
  })
  test('Should not return if validation success', async () => {
    const sut = makeSut()
    const error = await sut.validate({ any_field: 'any_name' })
    expect(error).toBeFalsy()
  })
})