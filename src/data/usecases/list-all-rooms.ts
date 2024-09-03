import { ListAllRoomsUseCase } from "@/domain/usecases";
import { FindRoomsRepository } from "../protocols/db";

export class ListAllRooms implements ListAllRoomsUseCase {
  constructor(private readonly findRoomsRepository: FindRoomsRepository) {}

  async listAll(
    params: ListAllRoomsUseCase.Params,
  ): Promise<ListAllRoomsUseCase.Result> {
    return await this.findRoomsRepository.find({
      limit: params.limit,
      page: params.page,
      filters: params.filters,
    });
  }
}
