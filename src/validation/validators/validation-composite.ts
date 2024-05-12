import { Validation } from '@/presentation/protocols'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}
  async validate(input: any): Promise<Error> {
    for await (const validation of this.validations) {
      try {
        const error = await validation.validate(input)
        if (error) {
          return error
        }
      } catch (error) {
        return error
      }
    }
  }
}