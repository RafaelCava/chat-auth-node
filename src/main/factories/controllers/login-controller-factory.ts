import { FindUserByEmailPostgresRepository } from "@/infra/db/postgres/repositories";
import { Controller } from "@/presentation/protocols";
import { makeLoginValidationFactory } from "../validators";
import { LoginController } from "@/presentation/controllers";
import { Authentication } from "@/data/usecases";
import { BcryptAdapter } from "@/infra/criptography/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import env from "@/main/config/env";

export const makeLoginController = (): Controller => {
  const findUserByEmailRepository = new FindUserByEmailPostgresRepository();
  const hashAdapter = new BcryptAdapter(env.saltHasher);
  const encrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer);
  const authenticationUseCase = new Authentication(
    findUserByEmailRepository,
    hashAdapter,
    encrypterAdapter,
  );
  const validation = makeLoginValidationFactory();
  const loginController = new LoginController(
    validation,
    authenticationUseCase,
  );
  return loginController;
};
