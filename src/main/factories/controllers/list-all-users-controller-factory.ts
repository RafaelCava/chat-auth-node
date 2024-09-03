import { Controller } from "@/presentation/protocols";
import { makeListAllUsersValidation } from "../validators";
import { FindUsersPostgresRepository } from "@/infra/db/postgres/repositories";
import { ListAllUsers } from "@/data/usecases";
import { ListAllUsersController } from "@/presentation/controllers";

export const makeListAllUsersController = (): Controller => {
  const validation = makeListAllUsersValidation();
  const findUsersRepository = new FindUsersPostgresRepository();
  const listUsersUseCase = new ListAllUsers(findUsersRepository);
  const controller = new ListAllUsersController(validation, listUsersUseCase);
  return controller;
};
