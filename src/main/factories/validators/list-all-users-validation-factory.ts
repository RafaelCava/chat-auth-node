import { Validation } from "@/presentation/protocols";
import { RequiredFieldValidation, ValidationComposite } from "@/validation/validators";

export const makeListAllUsersValidation = (): Validation => {
  const validation: Validation[] = []
  validation.push(new RequiredFieldValidation('page'))
  validation.push(new RequiredFieldValidation('limit'))
  return new ValidationComposite(validation)
}