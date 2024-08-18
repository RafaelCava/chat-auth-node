import { CreateRoomUseCase } from "@/domain/usecases";

export class CreateRoom implements CreateRoomUseCase {
  create(data: CreateRoomUseCase.Params): Promise<CreateRoomUseCase.Response> {
    throw new Error("Method not implemented.");
  }
}