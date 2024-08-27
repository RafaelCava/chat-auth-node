import { ListAllRoomsController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols";
import { makeListAllRoomsValidation } from "../validators";
import { ListAllRooms } from "@/data/usecases";
import { FindRoomsPostgresRepository } from "@/infra/db/postgres/repositories";

export const makeListAllRoomsController = (): Controller => {
  const validations = makeListAllRoomsValidation()
  const findRoomsRepository = new FindRoomsPostgresRepository()
  const listAllRoomsUseCase = new ListAllRooms(findRoomsRepository)
  return new ListAllRoomsController(validations, listAllRoomsUseCase)
}