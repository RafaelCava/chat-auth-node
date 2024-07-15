import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { LoadUserByToken } from "@/domain/usecases"

export class LoadUserByTokenSpy implements LoadUserByToken, Spy {
  params: LoadUserByToken.Params
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: LoadUserByToken.Result = { id: faker.string.uuid() }
  async load (params: LoadUserByToken.Params): Promise<LoadUserByToken.Result> {
    this.params = params
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}