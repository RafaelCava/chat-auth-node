import { Validation } from "@/presentation/protocols";
import { EmailValidator } from "../protocols";
import { InvalidParamError } from "@/presentation/erros";

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string, 
    private readonly emailValidator: EmailValidator
  ) {}
  async validate (input: any): Promise<Error> {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return await Promise.reject(new InvalidParamError(this.fieldName))
    }
    return await Promise.resolve(null)
  }
}