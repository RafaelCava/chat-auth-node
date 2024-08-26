import { FindRoomByNamePostgresRepository } from './../../../infra/db/postgres/repositories/find-room-by-name-postgres-repository';
import { Controller } from "@/presentation/protocols";
import { makeCreateRoomValidation } from "../validators";
import { CreateRoomController } from "@/presentation/controllers";
import { CreateRoomPostgresRepository } from '@/infra/db/postgres/repositories';
import { CreateRoom } from '@/data/usecases';

export const makeCreateRoomController = (): Controller => {
  const createRoomRepository = new CreateRoomPostgresRepository()
  const findRoomByNameRepository = new FindRoomByNamePostgresRepository()
  const createRoomUseCase = new CreateRoom(findRoomByNameRepository, createRoomRepository)
  return new CreateRoomController(makeCreateRoomValidation(), createRoomUseCase)
}