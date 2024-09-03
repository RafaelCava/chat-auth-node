import { Validation } from "@/presentation/protocols";
import {
  IsNumberFieldValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeListAllUsersValidation = (): Validation => {
  const validation: Validation[] = [];
  validation.push(new RequiredFieldValidation("page"));
  validation.push(new RequiredFieldValidation("limit"));
  validation.push(new IsNumberFieldValidation("page"));
  validation.push(new IsNumberFieldValidation("limit"));
  return new ValidationComposite(validation);
};
