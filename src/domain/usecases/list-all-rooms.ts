import { Room } from "../entities";

export interface ListAllRoomsUseCase {
  listAll: (params: ListAllRoomsUseCase.Params) => Promise<ListAllRoomsUseCase.Result>;
}

export namespace ListAllRoomsUseCase {
  export type Params = {
    limit: number;
    page: number;
    filters?: {
      ownerId?: string;
      name?: string;
    }
  };

  export type Result = Partial<Room>[];
}