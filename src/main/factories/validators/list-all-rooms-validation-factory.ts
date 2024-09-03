import { type Validation } from "@/presentation/protocols";
import {
  IsNumberFieldValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeListAllRoomsValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredField = ["limit", "page"];
  for (const field of requiredField) {
    validations.push(new RequiredFieldValidation(field));
    validations.push(new IsNumberFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
