import { Room } from "@/domain/entities";

export interface FindRoomByNameRepository {
  findByName(
    params: FindRoomByNameRepository.Params,
  ): Promise<FindRoomByNameRepository.Result>;
}

export namespace FindRoomByNameRepository {
  export type Params = {
    name: string;
    projection?: Array<keyof Room>;
  };

  export type Result = null | Partial<Room>;
}
