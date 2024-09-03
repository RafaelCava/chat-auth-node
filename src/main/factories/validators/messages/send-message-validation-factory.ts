import { Validation } from "@/presentation/protocols";
import {
  MaxStringLengthValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeSendMessageValidationFactory = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ["content", "roomId", "userId"];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new MaxStringLengthValidation("content", 500));
  return new ValidationComposite(validations);
};
