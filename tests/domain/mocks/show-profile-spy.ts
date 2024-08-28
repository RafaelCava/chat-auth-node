import { Spy } from '@/tests/shared/spy';
import { ShowProfileUseCase } from '@/domain/usecases';
import { faker } from '@faker-js/faker';
import { makeUser } from './user';
export class ShowProfileUseCaseSpy implements ShowProfileUseCase, Spy<string, ShowProfileUseCase.Response> {
  params: string
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence(3))
  result: any = makeUser()
  async show(userId: string): Promise<ShowProfileUseCase.Response> {
    this.params = userId
    ++this.count
    if (this.returnError) {
      throw this.errorValue
    }
    delete this.result.password
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}