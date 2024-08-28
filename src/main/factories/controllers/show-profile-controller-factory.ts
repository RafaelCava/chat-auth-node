import { ShowProfileController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeShowProfileValidation } from "../validators";
import { FindUserByIdPostgresRepository } from "@/infra/db/postgres/repositories";
import { ShowProfile } from "@/data/usecases";

export const makeShowProfileController = (): Controller => {
  const validation = makeShowProfileValidation()
  const findUserByIdRepository = new FindUserByIdPostgresRepository()
  const showProfileUseCase = new ShowProfile(findUserByIdRepository)
  return new ShowProfileController(validation, showProfileUseCase)
}