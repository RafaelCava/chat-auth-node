import { Middleware } from "@/presentation/protocols";
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware";
import { LoadUserByToken } from "@/data/usecases";
import { FindUserByIdPostgresRepository } from "@/infra/db/postgres/repositories";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import env from "@/main/config/env";

export const makeAuthMiddleware = (role?: string): Middleware => {
  const findUserByIdRepository = new FindUserByIdPostgresRepository();
  const encrypterAdapter = new JwtAdapter(env.jwtSecret, env.jwtIssuer);
  const loadUserByToken = new LoadUserByToken(
    encrypterAdapter,
    findUserByIdRepository,
  );
  return new AuthMiddleware(loadUserByToken, role);
};
