import { EmailValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/erros'
import { faker } from '@faker-js/faker'
import { EmailValidatorSpy } from '../mocks/email-validator'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return { sut, emailValidatorSpy }
}

describe('Email Validation', () => {
  it('Should be defined', () => {
    const { sut, emailValidatorSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(emailValidatorSpy).toBeDefined()
  })

  test('Should returns an error if EmailValidator returns false', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.returnFalse = true
    const error = sut.validate({ email: faker.internet.email() })
    expect(error).rejects.toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()
    await sut.validate({ email })
    expect(emailValidatorSpy.params).toBe(email)
    expect(emailValidatorSpy.count).toBe(1)
  })

  test('Should throws if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.returnError = true
    expect(sut.validate).rejects.toThrow()
  })
})