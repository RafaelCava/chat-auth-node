import { type Validation } from "@/presentation/protocols";
import {
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeCreateRoomValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ["name", "userId"];
  requiredFields.forEach((field) => {
    validations.push(new RequiredFieldValidation(field));
  });
  return new ValidationComposite(validations);
};
