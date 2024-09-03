import { Room } from "@/domain/entities";

export interface CreateRoomRepository {
  create(
    params: CreateRoomRepository.Params,
  ): Promise<CreateRoomRepository.Result>;
}

export namespace CreateRoomRepository {
  export type Params = Room;
  export type Result = Room;
}
