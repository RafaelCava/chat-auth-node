import { RoomNameAlreadyInUseError } from "@/presentation/erros";
import {
  type CreateRoomRepository,
  type FindRoomByNameRepository,
} from "../protocols/db";
import { type CreateRoomUseCase } from "@/domain/usecases";
import { Room } from "@/domain/entities";

export class CreateRoom implements CreateRoomUseCase {
  constructor(
    private readonly findRoomByNameRepository: FindRoomByNameRepository,
    private readonly createRoomRepository: CreateRoomRepository,
  ) {}

  async create(
    data: CreateRoomUseCase.Params,
  ): Promise<CreateRoomUseCase.Response> {
    const roomNameInUse = await this.findRoomByNameRepository.findByName({
      name: data.name,
      projection: ["id"],
    });
    if (roomNameInUse) {
      throw new RoomNameAlreadyInUseError();
    }
    const room = new Room({
      description: data.description,
      name: data.name,
      ownerId: data.ownerId,
    });

    const roomCreated = await this.createRoomRepository.create(room);
    return roomCreated;
  }
}
