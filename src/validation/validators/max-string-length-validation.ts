import { MaxStringLengthError } from "@/presentation/erros";
import { Validation } from "@/presentation/protocols";

export class MaxStringLengthValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly maxLength: number,
  ) {}

  async validate(input: any): Promise<Error | null> {
    if (input[this.fieldName].length > this.maxLength) {
      return new MaxStringLengthError(this.fieldName, this.maxLength);
    }
    return await Promise.resolve(null);
  }
}
