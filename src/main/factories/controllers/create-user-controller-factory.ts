import {
  CreateUserPostgresRepository,
  FindUserByEmailPostgresRepository,
} from "@/infra/db/postgres/repositories";
import { CreateUserController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeCreateUserValidation } from "../validators";
import { CreateUser } from "@/data/usecases";
import { BcryptAdapter } from "@/infra/criptography/bcrypt/bcrypt-adapter";
import env from "@/main/config/env";

export const makeCreateUserController = (): Controller => {
  const findUserByEmailRepository = new FindUserByEmailPostgresRepository();
  const createUserRepository = new CreateUserPostgresRepository();
  const validation = makeCreateUserValidation();
  const hasherAdapter = new BcryptAdapter(env.saltHasher);
  const createUserUseCase = new CreateUser(
    findUserByEmailRepository,
    hasherAdapter,
    createUserRepository,
  );
  return new CreateUserController(validation, createUserUseCase);
};
