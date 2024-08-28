import { User } from "../entities"

export interface ShowProfileUseCase {
  show: (userId: string) => Promise<ShowProfileUseCase.Response>
}

export namespace ShowProfileUseCase {
  export type Response = Omit<User, 'password'>
}