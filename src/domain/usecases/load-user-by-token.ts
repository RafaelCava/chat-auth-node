export interface LoadUserByTokenUseCase {
  load: (params: LoadUserByTokenUseCase.Params) => Promise<LoadUserByTokenUseCase.Result>
}

export namespace LoadUserByTokenUseCase {
  export type Params = {
    accessToken: string
    role?: string
  }
  
  export type Result = {
    id: string
  }
}