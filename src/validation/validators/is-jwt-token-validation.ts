import { InvalidParamError } from "@/presentation/erros"
import { Validation } from "@/presentation/protocols"
import { JwtTokenValidator } from "../protocols"


export class IsJwtTokenValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly jwtTokenValidator: JwtTokenValidator
  ) {}
  async validate (input: any): Promise<Error> {
    if (!this.jwtTokenValidator.isJwt(input[this.fieldName])) {
      return await Promise.reject(new InvalidParamError(this.fieldName))
    }
    return await Promise.resolve(null)
  }
}