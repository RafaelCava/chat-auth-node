export interface LoadUserByToken {
  load: (params: LoadUserByToken.Params) => Promise<LoadUserByToken.Result>
}

export namespace LoadUserByToken {
  export type Params = {
    accessToken: string
    role?: string
  }
  
  export type Result = {
    id: string
  }
}