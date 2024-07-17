import { CreateUserPostgresRepository, FindUserByEmailPostgresRepository } from "@/infra/db/postgres/repositories";
import { CreateUserController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeCreateUserValidation } from "../validators";
import { CreateUser } from "@/data/usecases";
import { BcryptAdapter } from "@/infra/criptography/bcrypt/bcrypt-adapter";

export const makeCreateUserController = (): Controller => {
  const findUserByEmailRepository = new FindUserByEmailPostgresRepository();
  const createUserRepository = new CreateUserPostgresRepository();
  const validation = makeCreateUserValidation()
  const salt = 11
  const hasherAdapter = new BcryptAdapter(salt);
  const createUserUseCase = new CreateUser(findUserByEmailRepository, hasherAdapter, createUserRepository)
  return new CreateUserController(validation, createUserUseCase)
}