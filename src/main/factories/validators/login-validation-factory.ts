import { EmailValidatorAdapter } from "@/infra/validators";
import { Validation } from "@/presentation/protocols";
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "@/validation/validators";

export const makeLoginValidationFactory = (): Validation => {
  const validations: Validation[] = []
  validations.push(new RequiredFieldValidation('email'))
  validations.push(new RequiredFieldValidation('password'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}