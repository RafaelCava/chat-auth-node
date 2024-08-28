import { Validation } from "@/presentation/protocols";
import { RequiredFieldValidation, ValidationComposite } from "@/validation/validators";

export const makeShowProfileValidation = (): Validation => {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('userId'))
  return new ValidationComposite(validations)
}