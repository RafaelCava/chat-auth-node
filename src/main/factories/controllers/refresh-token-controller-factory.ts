import { RefreshTokenController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeRefreshTokenValidationFactory } from "../validators";
import { RefreshToken } from "@/data/usecases";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import env from "@/main/config/env";
import { FindUserByIdPostgresRepository } from "@/infra/db/postgres/repositories";

export const makeRefreshTokenController = (): Controller => {
  const validation = makeRefreshTokenValidationFactory();
  const encrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer);
  const findUserByIdRepository = new FindUserByIdPostgresRepository();
  const refreshTokenUseCase = new RefreshToken(
    encrypterAdapter,
    findUserByIdRepository,
    encrypterAdapter,
  );
  const controller = new RefreshTokenController(
    validation,
    refreshTokenUseCase,
  );
  return controller;
};
