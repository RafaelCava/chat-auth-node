import { EmailValidatorAdapter } from "@/infra/validators";
import { Validation } from "@/presentation/protocols";
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeCreateUserValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ["name", "email", "password"];
  requiredFields.forEach((requiredField) => {
    validations.push(new RequiredFieldValidation(requiredField));
  });
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
