import { InvalidParamError } from "@/presentation/erros";
import { Validation } from "@/presentation/protocols";

export class IsNumberFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  async validate(input: any): Promise<Error | null> {
    if (Number.isNaN(Number(input[this.fieldName]))) {
      return await Promise.reject(new InvalidParamError(this.fieldName));
    }
    return await Promise.resolve(null);
  }
}
