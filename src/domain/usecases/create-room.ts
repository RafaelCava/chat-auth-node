import { Room } from "../entities";

export interface CreateRoomUseCase {
  create(data: CreateRoomUseCase.Params): Promise<CreateRoomUseCase.Response>;
}

export namespace CreateRoomUseCase {
  export type Params = {
    name: string;
    description?: string;
    ownerId: string;
  };

  export type Response = Room;
}
