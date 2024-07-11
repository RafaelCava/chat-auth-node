import { CreateUserPostgresRepository, FindUserByEmailPostgresRepository } from "@/infra/db/postgres/repositories";
import { CreateUserController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeCreateUserValidation } from "../validators";
import { CreateUser } from "@/data/usecases";

export const makeCreateUserController = (): Controller => {
  const findUserByEmailRepository = new FindUserByEmailPostgresRepository();
  const createUserRepository = new CreateUserPostgresRepository();
  const validation = makeCreateUserValidation()
  const createUserUseCase = new CreateUser(findUserByEmailRepository, createUserRepository)
  return new CreateUserController(validation, createUserUseCase)
}