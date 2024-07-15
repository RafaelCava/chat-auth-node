import { User } from "@/domain/entities"

export interface FindUserByIdRepository {
  findById: (params: FindUserByIdRepository.Params) => Promise<FindUserByIdRepository.Result>
}

export namespace FindUserByIdRepository {
  export type Result = Partial<User>
  export type Params = {
    id: string
    projection?: Array<keyof User>
  }
}