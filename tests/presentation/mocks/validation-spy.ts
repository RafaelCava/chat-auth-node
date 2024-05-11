import { Validation } from '@/presentation/protocols';
import { Spy } from '@/tests/shared/spy';
import { faker } from '@faker-js/faker';

export class ValidationSpy implements Validation<any>, Spy<any, null> {
  count = 0
  params: any
  returnError = false
  throwsError = false
  errorValue = new Error(faker.lorem.sentence())
  result = null
  validate(input: any): Promise<Error | null> {
    this.count++
    this.params = input
    if (this.returnError) {
      return Promise.resolve(this.errorValue)
    }
    if (this.throwsError) {
      throw this.errorValue
    }
    return Promise.resolve(this.result)
  }
}