import { type Validation } from "@/presentation/protocols";
import {
  ValidationComposite,
  ConnectMongoDatabaseValidation,
  ConnectPostgresDatabaseValidation,
} from "@/validation/validators";

export const makeHealthCheckValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(
    new ConnectMongoDatabaseValidation(),
    new ConnectPostgresDatabaseValidation(),
  );
  return new ValidationComposite(validations);
};
