import { MissingParamError } from "@/presentation/erros";
import { Validation } from "@/presentation/protocols";

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  async validate(input: any): Promise<Error> {
    if (!input[this.fieldName]) {
      return await Promise.reject(new MissingParamError(this.fieldName));
    }
    return await Promise.resolve(null);
  }
}
