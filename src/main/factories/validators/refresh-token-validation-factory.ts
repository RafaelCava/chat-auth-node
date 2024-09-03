import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import env from "@/main/config/env";
import { Validation } from "@/presentation/protocols";
import {
  IsJwtTokenValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from "@/validation/validators";

export const makeRefreshTokenValidationFactory = (): Validation => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldValidation("refreshToken"));
  const decrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer);
  validations.push(new IsJwtTokenValidation("refreshToken", decrypterAdapter));
  return new ValidationComposite(validations);
};
