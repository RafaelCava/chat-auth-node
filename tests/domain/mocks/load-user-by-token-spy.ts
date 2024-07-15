import { Spy } from "@/tests/shared/spy"
import { faker } from "@faker-js/faker"
import { LoadUserByTokenUseCase } from "@/domain/usecases"

export class LoadUserByTokenSpy implements LoadUserByTokenUseCase, Spy {
  params: LoadUserByTokenUseCase.Params
  count: number = 0
  returnError: boolean = false
  returnNull?: boolean = false
  errorValue: Error = new Error(faker.lorem.sentence())
  result: LoadUserByTokenUseCase.Result = { id: faker.string.uuid() }
  async load (params: LoadUserByTokenUseCase.Params): Promise<LoadUserByTokenUseCase.Result> {
    this.params = params
    this.count++
    if (this.returnError) {
      throw this.errorValue
    }
    return await (this.returnNull ? Promise.resolve(null) : Promise.resolve(this.result))
  }
}