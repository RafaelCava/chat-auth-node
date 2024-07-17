import { TokenLogin } from "../models";

export interface AuthenticationUseCase {
  auth: (params: AuthenticationUseCase.Params) => Promise<AuthenticationUseCase.Result>
}

export namespace AuthenticationUseCase {
  export type Params = {
    email: string;
    password: string;
  };
  export type Result = TokenLogin;
}