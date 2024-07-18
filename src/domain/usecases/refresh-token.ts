import { TokenLogin } from "../models"

export interface RefreshTokenUseCase {
  refreshToken: (data: RefreshTokenUseCase.Params) => Promise<RefreshTokenUseCase.Result>
}

export namespace RefreshTokenUseCase {
  export type Params = {
    refreshToken: string
  }

  export type Result = TokenLogin
}