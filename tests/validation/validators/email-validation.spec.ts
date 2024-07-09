import { EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols'
import { InvalidParamError } from '@/presentation/erros'
import { Spy } from '@/tests/shared/spy'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

class EmailValidatorSpy implements EmailValidator, Spy {
  params: string = ''
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  returnFalse?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: boolean = true
  isValid (email: string): boolean {
    this.params = email
    ++this.count
    if (this.returnError) {
      throw this.errorValue
    }
    if (this.returnNull) {
      return null
    }
    if (this.returnFalse) {
      return false
    }
    return this.result
  }
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